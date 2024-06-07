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
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { CreateUserRequest, UsersResponse } from 'src/model/users.model';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
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
    };
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
    createRequest.role = createRequest.role ?? 'user';

    const checkUserExist = await this.prismaService.user.count({
      where: {
        username: createRequest.username,
      },
    });

    if (checkUserExist) throw new ConflictException('Username already exist');

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
}
