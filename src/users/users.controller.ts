import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  CreateUserRequest,
  RequestWithUser,
  UsersResponse,
} from '../model/users.model';
import { WebResponse } from '../model/web.model';
import { UsersService } from './users.service';

@Controller('/api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async get(
    @Request() req: RequestWithUser,
  ): Promise<WebResponse<UsersResponse>> {
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

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async remove(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
  ): Promise<WebResponse<UsersResponse>> {
    const result = await this.usersService.remove(id, req.user);
    return { data: result };
  }
}
