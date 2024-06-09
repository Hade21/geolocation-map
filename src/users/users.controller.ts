import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserRequest, UsersResponse } from 'src/model/users.model';
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

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() body: CreateUserRequest,
  ): Promise<WebResponse<UsersResponse>> {
    body.id = id;
    const result = await this.usersService.update(body);
    return { data: result };
  }
}
