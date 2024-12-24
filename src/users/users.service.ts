import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { MailService } from '../mail/mail.service';
import {
  ChangePassword,
  CreateUserRequest,
  UsersResponse,
} from '../model/users.model';
import { UserValidation } from './users.validation';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    private mailService: MailService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toResponseBody(user: User): UsersResponse {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  async checkUserExist(username: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (user) throw new ConflictException('Username already exist');

    return user;
  }

  async create(request: CreateUserRequest): Promise<UsersResponse> {
    this.logger.info(
      `UsersService.create: New request create user ${JSON.stringify(request)}`,
    );
    const createRequest: CreateUserRequest = this.validationService.validate(
      UserValidation.CREATE,
      request,
    );

    createRequest.id = uuid();
    createRequest.role = createRequest.role ?? 'USER';

    await this.checkUserExist(createRequest.username);

    const newUser = await this.prismaService.user.create({
      data: {
        ...createRequest,
        password: await bcrypt.hash(createRequest.password, 10),
      },
    });

    return this.toResponseBody(newUser);
  }

  async findByUsername(username: string): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<UsersResponse> {
    const user = await this.findByUsername(username);

    if (!user) throw new HttpException('User not found', 404);

    if (user && (await bcrypt.compare(password, user.password))) {
      const result = this.toResponseBody(user);
      return result;
    }

    throw new UnauthorizedException('Invalid credentials');
  }

  async get(user: User): Promise<UsersResponse> {
    const result = await this.prismaService.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (!result) throw new HttpException('User not found', 404);

    return this.toResponseBody(result);
  }

  async update(request: CreateUserRequest): Promise<UsersResponse> {
    this.logger.info(
      `UsersService.update: New request update user ${JSON.stringify(request)}`,
    );
    const updateRequest: CreateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    const userData = await this.prismaService.user.findUnique({
      where: {
        username: updateRequest.username,
      },
    });

    if (!userData) throw new HttpException('User not found', 404);

    if (userData.id !== updateRequest.id)
      throw new ConflictException('Username already exist');

    const user = await this.prismaService.user.update({
      where: {
        id: updateRequest.id,
      },
      data: {
        ...updateRequest,
      },
    });

    return this.toResponseBody(user);
  }

  async remove(id: string, user: User): Promise<UsersResponse> {
    this.logger.info(
      `UsersService.remove: New request remove user ${JSON.stringify(id)}`,
    );

    const userExist = this.prismaService.user.findFirst({
      where: { username: user.username },
    });

    if (!userExist) throw new HttpException('User not found', 404);

    const userById = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (userById.username !== user.username)
      throw new HttpException('User not found', 404);

    const deletedUser = await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return this.toResponseBody(deletedUser);
  }

  async getAllUsers(user: User): Promise<UsersResponse[]> {
    this.logger.info(`UsersService.getAllUsers: New request get all users`);

    const isAdmin = await this.prismaService.user.findUnique({
      where: {
        username: user.username,
      },
    });

    if (isAdmin.role !== 'ADMIN')
      throw new UnauthorizedException('Only admin can get all users');

    const users = await this.prismaService.user.findMany();
    return users.map((user) => this.toResponseBody(user));
  }

  async changeRole(
    id: string,
    user: User,
    role: 'ADMIN' | 'USER',
  ): Promise<UsersResponse> {
    this.logger.info(
      `UsersService.changeRole: New request change role user ${JSON.stringify(id)}`,
    );

    const isAdmin = await this.prismaService.user.findFirst({
      where: {
        username: user.username,
      },
    });
    const userExist = await this.prismaService.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExist) throw new HttpException('User not found', 404);

    if (isAdmin.role !== 'ADMIN')
      throw new UnauthorizedException('Only admin can change role');

    const updatedUser = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        role: role,
      },
    });

    return {
      ...this.toResponseBody(updatedUser),
      role: updatedUser.role,
    };
  }

  async changePassword(
    user: User,
    body: ChangePassword,
  ): Promise<UsersResponse> {
    const userExist = await this.validateUser(user.username, body.oldPassword);
    if (body.newPassword !== body.confirmPassword) {
      throw new HttpException('Password not match', 400);
    }
    const hashedPassword = await bcrypt.hash(body.newPassword, 10);
    const updateUser = await this.prismaService.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    return this.toResponseBody(updateUser);
  }

  async forgotPassword(
    email: string,
  ): Promise<{ statusCode: number; message: string }> {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: { equals: email },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const token = nanoid(64);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    await this.prismaService.authLog.create({
      data: {
        id: uuid(),
        users: {
          connect: {
            id: user.id,
          },
        },
        resetToken: token,
        resetTokenExpiry: expiryDate,
        timeStamp: new Date().toISOString(),
      },
    });

    await this.mailService.sendForgotPassword(user, token);
    return { statusCode: 200, message: 'Reset token has been sent to email' };
  }

  async resetPassword(newPassword: string, resetToken: string) {
    const token = await this.prismaService.authLog.findFirst({
      where: {
        resetToken,
        resetTokenExpiry: { gte: new Date() },
      },
    });
    console.log('🚀 ~ UsersService ~ resetPassword ~ token:', token);
    if (!token) {
      throw new UnauthorizedException('Invalid link or token expired');
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: token.userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: { ...user },
    });

    return {
      statusCode: 200,
      message: 'Password has been reset, try to login again',
    };
  }
}
