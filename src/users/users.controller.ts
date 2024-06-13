import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  CreateUserRequest,
  RequestWithUser,
  UsersResponse,
} from '../model/users.model';
import { WebResponse } from '../model/web.model';
import { UsersService } from './users.service';

@ApiTags('Users')
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
  @ApiBody({ type: CreateUserRequest, description: 'Update user' })
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

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  @ApiBody({ type: CreateUserRequest, description: 'Change user role' })
  async changeRole(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
    @Body() body: Pick<CreateUserRequest, 'role'>,
  ): Promise<WebResponse<UsersResponse>> {
    body.role = body.role ?? 'USER';
    const result = await this.usersService.changeRole(id, req.user);
    return { data: result };
  }
}
