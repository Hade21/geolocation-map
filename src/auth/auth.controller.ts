import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserRequest, UsersResponse } from '../model/users.model';
import { WebResponse } from '../model/web.model';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: CreateUserRequest,
  ): Promise<WebResponse<UsersResponse>> {
    const result = await this.authService.register(body);
    return { data: result };
  }
}
