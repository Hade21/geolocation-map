import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
  @ApiBody({ description: 'Get current user' })
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
  @ApiBody({ description: 'Delete user' })
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
    const result = await this.usersService.changeRole(id, req.user, body.role);
    return { data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all')
  @ApiBody({ description: 'Get all users' })
  async getAllUsers(
    @Request() req: RequestWithUser,
  ): Promise<WebResponse<UsersResponse[]>> {
    const result = await this.usersService.getAllUsers(req.user);
    return { data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/profile-picture')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({ type: File, description: 'Upload profile picture' })
  async setProfilePict(
    @Request() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<WebResponse<any>> {
    const result = await this.usersService.setProfilePic(file, req.user);
    return { data: result };
  }
}
