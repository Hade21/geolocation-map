import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Unit } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  CreateUnitsRequest,
  UnitsResponse,
  UpdateUnitsRequest,
} from '../model/units.model';
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

  async checkUnitExist(id: string): Promise<Unit> {
    const unit = await this.prismaService.unit.findUnique({
      where: {
        id,
      },
    });

    if (!unit) throw new HttpException('Unit not found', 404);

    return unit;
  }

  async create(request: CreateUnitsRequest): Promise<UnitsResponse> {
    this.logger.info(
      `UnitsService.create: new request create units ${JSON.stringify(request)}`,
    );
    const createRequest: CreateUnitsRequest = this.validationService.validate(
      UnitsValidation.CREATE,
      request,
    );

    const checkUnitExist = await this.prismaService.unit.count({
      where: {
        id: createRequest.id,
      },
    });

    if (checkUnitExist) throw new HttpException('Units already exist', 409);

    const newUnits = await this.prismaService.unit.create({
      data: createRequest,
    });

    return this.toResponseBody(newUnits);
  }

  async update(request: UpdateUnitsRequest): Promise<UnitsResponse> {
    this.logger.info(
      `UnitsService.update: New request update unit from ${JSON.stringify(request)}`,
    );
    const updateRequest: UpdateUnitsRequest = this.validationService.validate(
      UnitsValidation.UPDATE,
      request,
    );

    let unit = await this.checkUnitExist(updateRequest.id);

    if (!updateRequest.name && !updateRequest.egi && !updateRequest.type)
      throw new HttpException('Missing input fields', 400);

    unit = await this.prismaService.unit.update({
      where: {
        id: updateRequest.id,
      },
      data: updateRequest,
    });

    return this.toResponseBody(unit);
  }
}
