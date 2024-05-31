import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Unit } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { v4 as uuid } from 'uuid';
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
    let checkIdExist;
    this.logger.info(
      `UnitsService.create: new request create units ${JSON.stringify(request)}`,
    );
    const createRequest: CreateUnitsRequest = this.validationService.validate(
      UnitsValidation.CREATE,
      request,
    );

    const checkUnitExist = await this.prismaService.unit.count({
      where: {
        name: createRequest.name,
      },
    });

    if (checkUnitExist) throw new HttpException('Units already exist', 409);

    do {
      createRequest.id = uuid();
      checkIdExist = await this.prismaService.unit.count({
        where: {
          id: createRequest.id,
        },
      });
    } while (checkIdExist);

    const newUnits = await this.prismaService.unit.create({
      data: createRequest,
    });

    console.log(newUnits);

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

  async delete(id: string): Promise<UnitsResponse> {
    this.logger.info(
      `UnitsService.delete: New request delete unit ${JSON.stringify(id)}`,
    );
    await this.checkUnitExist(id);

    const unit = await this.prismaService.unit.delete({
      where: {
        id,
      },
    });

    return this.toResponseBody(unit);
  }
}
