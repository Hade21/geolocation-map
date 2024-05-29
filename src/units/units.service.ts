import { Inject, Injectable } from '@nestjs/common';
import { Unit } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { UnitsRequest, UnitsResponse } from '../model/units.model';
import { UnitsValidation } from './units.validation';

@Injectable()
export class UnitsService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  toResponseBody(unit: Unit): UnitsResponse {
    return {
      id: unit.id,
      name: unit.name,
      type: unit.type,
      egi: unit.egi,
    };
  }

  async create(request: UnitsRequest): Promise<UnitsResponse> {
    this.logger.info(
      `UnitsService.create: new request create units ${JSON.stringify(request)}`,
    );
    const createRequest: UnitsRequest = this.validationService.validate(
      UnitsValidation.CREATE,
      request,
    );

    const newUnits = await this.prismaService.unit.create({
      data: createRequest,
    });

    return this.toResponseBody(newUnits);
  }
}
