import { Inject, Injectable } from '@nestjs/common';
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
}
