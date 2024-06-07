import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {
  CreateUserRequest,
  LoginResponse,
  LoginUserRequest,
  UsersResponse,
} from 'src/model/users.model';
import { Logger } from 'winston';
import { ValidationService } from '../common/validation.service';
import { UsersService } from '../users/users.service';
import { AuthValidation } from './auth.validation';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private validationService: ValidationService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(body: CreateUserRequest): Promise<UsersResponse> {
    const result = await this.userService.create(body);
    return result;
  }

  async login(request: LoginUserRequest): Promise<LoginResponse> {
    this.logger.info(
      `AuthService.login: New request login ${JSON.stringify(request)}`,
    );

    const loginRequest: LoginUserRequest = this.validationService.validate(
      AuthValidation.LOGIN,
      request,
    );

    const { username, password } = loginRequest;
    const user = await this.userService.validateUser(username, password);

    const payload = {
      username: user.username,
      sub: {
        name: `${user.firstName} ${user.lastName}`,
      },
    };

    return {
      ...user,
      token: { accessToken: this.jwtService.sign(payload) },
    };
  }
}
