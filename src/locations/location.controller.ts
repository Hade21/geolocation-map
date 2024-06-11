import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import {
  AddLocationRequest,
  LocationsResponse,
} from '../model/locations.model';
import { RequestWithUser } from '../model/users.model';
import { WebResponse } from '../model/web.model';
import { UsersService } from '../users/users.service';
import { LocationService } from './location.service';

@Controller(`/api/v1/units/:unitId/location`)
export class LocationController {
  constructor(
    private locationsService: LocationService,
    private userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Param('unitId') unitId: string,
    @Body() request: AddLocationRequest,
    @Request() req: RequestWithUser,
  ): Promise<WebResponse<LocationsResponse>> {
    const user: User = await this.userService.findByUsername(req.user.username);
    request.createdBy = user.id;
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
