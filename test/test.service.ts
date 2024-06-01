import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../src/common/prisma.service';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUnits() {
    return this.prismaService.unit.deleteMany({
      where: {
        name: 'test',
      },
    });
  }

  async createUnits() {
    return this.prismaService.unit.create({
      data: {
        id: uuid(),
        name: 'test',
        type: 'test',
        egi: 'test',
      },
    });
  }

  async getUnits() {
    return this.prismaService.unit.findFirst({
      where: {
        name: 'test',
      },
    });
  }

  async deleteAllUnits() {
    return this.prismaService.unit.deleteMany({});
  }
}
