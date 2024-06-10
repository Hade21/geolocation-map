import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Location } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuid } from 'uuid';
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
      createdBy: location.createdBy,
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

    const count = await this.prismaService.location.count({
      where: {
        unitId: createRequest.unitId,
      },
    });

    if (count >= 5) {
      const locations = await this.prismaService.location.findMany({
        where: {
          unitId: createRequest.unitId,
        },
        orderBy: {
          dateTime: 'desc',
        },
      });

      await this.prismaService.location.delete({
        where: {
          id: locations[4].id,
        },
      });
    }

    createRequest.id = uuid();
    const newLocation = await this.prismaService.location.create({
      data: {
        id: createRequest.id,
        long: createRequest.long,
        lat: createRequest.lat,
        alt: createRequest.alt,
        location: createRequest.location,
        dateTime: createRequest.dateTime,
        units: {
          connect: {
            id: createRequest.unitId,
          },
        },
        users: {
          connect: {
            id: createRequest.createdBy,
          },
        },
      },
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
      orderBy: {
        dateTime: 'desc',
      },
      take: 5,
    });

    if (!locations) throw new HttpException('Locations not found', 404);

    return locations.map((location) => this.toBodyResponse(location));
  }
}
