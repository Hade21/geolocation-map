import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../src/common/prisma.service';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUsers() {
    return this.prismaService.user.deleteMany({});
  }

  async addUser() {
    return this.prismaService.user.create({
      data: {
        id: uuid(),
        username: 'test',
        firstName: 'test',
        lastName: 'test',
        role: 'USER',
        email: 'test',
        password: await hash('test', 10),
      },
    });
  }

  async getUsers() {
    return this.prismaService.user.findFirst({
      where: {
        username: 'test',
      },
    });
  }

  async deleteUnits() {
    return this.prismaService.unit.deleteMany({
      where: {
        name: 'test',
      },
    });
  }

  async createUnits() {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
    return this.prismaService.unit.create({
      data: {
        id: uuid(),
        name: 'test',
        type: 'test',
        egi: 'test',
        users: {
          connect: {
            id: user.id,
          },
        },
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

  async deleteLocations() {
    return this.prismaService.location.deleteMany({});
  }

  async addLocation() {
    const unit = await this.prismaService.unit.findFirst({
      where: {
        name: 'test',
      },
    });
    const user = await this.prismaService.user.findUnique({
      where: {
        username: 'test',
      },
    });
    return this.prismaService.location.create({
      data: {
        id: uuid(),
        long: 'test',
        lat: 'test',
        alt: 'test',
        location: 'test',
        dateTime: new Date().toISOString(),
        units: {
          connect: {
            id: unit.id,
          },
        },
        users: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }
}
