import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { CreateUserRequest, UsersResponse } from '../model/users.model';
import { UserValidation } from './users.validation';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
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

    const userExist = this.checkUserExist(updateRequest.username);

    if (!userExist) throw new HttpException('User not found', 404);

    const user = await this.prismaService.user.update({
      where: {
        id: updateRequest.id,
      },
      data: {
        ...updateRequest,
        password: await bcrypt.hash(updateRequest.password, 10),
      },
    });

    return this.toResponseBody(user);
  }

  async remove(id: string, user: User): Promise<UsersResponse> {
    this.logger.info(
      `UsersService.remove: New request remove user ${JSON.stringify(id)}`,
    );

    const userExist = this.checkUserExist(user.username);

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
}
