import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
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

@ApiTags('Auth')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: CreateUserRequest, description: 'User Register' })
  async register(
    @Body() body: CreateUserRequest,
  ): Promise<WebResponse<UsersResponse>> {
    const result = await this.authService.register(body);
    return { data: result };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiBody({ type: CreateUserRequest, description: 'User Login' })
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
