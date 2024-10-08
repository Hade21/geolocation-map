import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  CreateUserRequest,
  LoginResponse,
  Payload,
  RefreshResponse,
  UsersResponse,
} from '../model/users.model';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(body: CreateUserRequest): Promise<UsersResponse> {
    const result = await this.userService.create(body);
    return result;
  }

  async login(user: User): Promise<LoginResponse> {
    this.logger.info(
      `AuthService.login: New request login ${JSON.stringify(user)}`,
    );
    const payload: Payload = {
      username: user.username,
      sub: {
        name: `${user.firstName} ${user.lastName}`,
      },
    };

    return {
      ...user,
      token: {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      },
    };
  }

  async refresh(user: User): Promise<RefreshResponse> {
    this.logger.info(
      `AuthService.refersh: New request refersh ${JSON.stringify(user)}`,
    );

    const payload: Payload = {
      username: user.username,
      sub: {
        name: `${user.firstName} ${user.lastName}`,
      },
    };

    return {
      ...user,
      token: {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: '2h',
        }),
      },
    };
  }
}
