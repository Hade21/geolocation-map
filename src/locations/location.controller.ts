import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  AddLocationRequest,
  LocationsResponse,
} from '../model/locations.model';
import { WebResponse } from '../model/web.model';
import { LocationService } from './location.service';

@Controller(`/api/v1/units/:unitId/location`)
export class LocationController {
  constructor(private locationsService: LocationService) {}

  @Post()
  async create(
    @Param('unitId') unitId: string,
    @Body() request: AddLocationRequest,
  ): Promise<WebResponse<LocationsResponse>> {
    request.unitId = unitId;
    const response = await this.locationsService.create(request);
    return { data: response };
  }
}
