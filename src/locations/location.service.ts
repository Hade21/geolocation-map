import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Location } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  AddLocationRequest,
  LocationsResponse,
} from '../model/locations.model';
import { LocationValidation } from './location.validation';

@Injectable()
export class LocationService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toBodyResponse(location: Location): LocationsResponse {
    return {
      id: location.id,
      long: location.long,
      lat: location.lat,
      alt: location.alt,
      location: location.location,
      dateTime: location.dateTime,
    };
  }

  async create(request: AddLocationRequest): Promise<LocationsResponse> {
    this.logger.info(
      `LocationService.create: New request create location ${JSON.stringify(request)}`,
    );
    const createRequest: AddLocationRequest = this.validationService.validate(
      LocationValidation.CREATE,
      request,
    );

    const newLocation = await this.prismaService.location.create({
      data: createRequest,
    });

    return this.toBodyResponse(newLocation);
  }

  async get(unitId: string): Promise<LocationsResponse[]> {
    this.logger.info(
      `LocationsService.get: new request get location from ${JSON.stringify(unitId)}`,
    );

    const locations = await this.prismaService.location.findMany({
      where: {
        unitId,
      },
    });

    if (!locations) throw new HttpException('Locations not found', 404);

    return locations.map((location) => this.toBodyResponse(location));
  }
}
