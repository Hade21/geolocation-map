import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UsersResponse } from 'src/model/users.model';
import { WebResponse } from 'src/model/web.model';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('/api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(@Request() req): Promise<WebResponse<UsersResponse>> {
    const result = await this.usersService.get(req.user);
    return { data: result };
  }
}
