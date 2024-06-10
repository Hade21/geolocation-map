import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  CreateUserRequest,
  RefreshResponse,
  RequestWithUser,
  UsersResponse,
} from '../model/users.model';
import { WebResponse } from '../model/web.model';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshJwtAuthGuard } from './guard/refresh-jwt-auth.guard';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: CreateUserRequest,
  ): Promise<WebResponse<UsersResponse>> {
    const result = await this.authService.register(body);
    return { data: result };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Request() req: RequestWithUser,
  ): Promise<WebResponse<UsersResponse>> {
    const result = await this.authService.login(req.user);
    return { data: result };
  }

  @UseGuards(RefreshJwtAuthGuard)
  @Post('refresh')
  async refresh(
    @Request() req: RequestWithUser,
  ): Promise<WebResponse<RefreshResponse>> {
    const result = await this.authService.refresh(req.user);
    return { data: result };
  }
}
