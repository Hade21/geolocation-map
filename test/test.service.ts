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
        email: 'test@mail.com',
        password: await hash('test', 10),
      },
    });
  }

  async addUserAdmin() {
    return this.prismaService.user.create({
      data: {
        id: uuid(),
        username: 'test admin',
        firstName: 'test',
        lastName: 'test',
        role: 'ADMIN',
        email: 'test@mail.com',
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
    return this.prismaService.unit.deleteMany({});
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
        name: 'TEST',
        type: 'TEST',
        egi: 'TEST',
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
        name: 'TEST',
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
        name: 'TEST',
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

  async deleteAuth() {
    return this.prismaService.authLog.deleteMany({});
  }
}
