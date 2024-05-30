import { Body, Controller, Param, Post, Put } from '@nestjs/common';
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

  @Post()
  async create(
    @Body() request: CreateUnitsRequest,
  ): Promise<WebResponse<UnitsResponse>> {
    const result = await this.unitsService.create(request);
    return { data: result };
  }

  @Put('/:unitId')
  async update(
    @Param('unitId') unitId: string,
    @Body() request: UpdateUnitsRequest,
  ): Promise<WebResponse<UnitsResponse>> {
    request.id = unitId;
    const result = await this.unitsService.update(request);
    return { data: result };
  }
}
