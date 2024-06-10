import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  AddLocationRequest,
  LocationsResponse,
} from '../model/locations.model';
import { WebResponse } from '../model/web.model';
import { LocationService } from './location.service';

@Controller(`/api/v1/units/:unitId/location`)
export class LocationController {
  constructor(private locationsService: LocationService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('unitId') unitId: string,
    @Body() request: AddLocationRequest,
  ): Promise<WebResponse<LocationsResponse>> {
    request.unitId = unitId;
    const result = await this.locationsService.create(request);
    return { data: result };
  }

  @Get()
  async get(
    @Param('unitId') unitId: string,
  ): Promise<WebResponse<LocationsResponse[]>> {
    const result = await this.locationsService.get(unitId);
    return { data: result };
  }
}
