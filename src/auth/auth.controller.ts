import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserRequest, UsersResponse } from '../model/users.model';
import { WebResponse } from '../model/web.model';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';

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
  async login(@Request() req): Promise<WebResponse<UsersResponse>> {
    const result = await this.authService.login(req.user);
    return { data: result };
  }
}
