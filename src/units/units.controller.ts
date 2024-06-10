import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  CreateUnitsRequest,
  UnitsResponse,
  UpdateUnitsRequest,
} from '../model/units.model';
import { WebResponse } from '../model/web.model';
import { UnitsService } from './units.service';

@Controller('/api/v1/units')
export class UnitsController {
  constructor(private unitsService: UnitsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() request: CreateUnitsRequest,
  ): Promise<WebResponse<UnitsResponse>> {
    const result = await this.unitsService.create(request);
    return { data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:unitId')
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
}
