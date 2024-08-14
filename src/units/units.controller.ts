import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  CreateUnitsRequest,
  UnitsResponse,
  UpdateUnitsRequest,
} from '../model/units.model';
import { RequestWithUser } from '../model/users.model';
import { WebResponse } from '../model/web.model';
import { UsersService } from '../users/users.service';
import { UnitsService } from './units.service';

@ApiTags('Units')
@Controller('/api/v1/units')
export class UnitsController {
  constructor(
    private unitsService: UnitsService,
    private userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBody({ type: CreateUnitsRequest, description: 'Create Units' })
  async create(
    @Body() request: CreateUnitsRequest,
    @Request() req: RequestWithUser,
  ): Promise<WebResponse<UnitsResponse>> {
    const user: User = await this.userService.findByUsername(req.user.username);
    request.createdBy = user.id;
    const result = await this.unitsService.create(request);
    return { data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:unitId')
  @ApiBody({ type: UpdateUnitsRequest, description: 'Update Units' })
  async update(
    @Param('unitId') unitId: string,
    @Body() request: UpdateUnitsRequest,
  ): Promise<WebResponse<UnitsResponse>> {
    request.id = unitId;
    const result = await this.unitsService.update(request);
    return { data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:unitId')
  async delete(
    @Param('unitId') unitId: string,
  ): Promise<WebResponse<{ message: string }>> {
    await this.unitsService.delete(unitId);
    return { data: { message: 'Unit deleted successfully' } };
  }

  @Get()
  async get(): Promise<WebResponse<UnitsResponse[]>> {
    const result = await this.unitsService.get();
    return { data: result };
  }

  @Get('/:id')
  async getById(@Param('id') id: string): Promise<WebResponse<UnitsResponse>> {
    const result = await this.unitsService.getById(id);
    return { data: result };
  }
}
