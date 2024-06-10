import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { Logger } from 'winston';
import { AppModule } from './../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('UserController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('PUT /api/v1/users/:id', () => {
    it(`Should be rejected if field is missing`, async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.deleteUsers();
      await testService.addUser();
      const user = await testService.getUsers();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .put(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          firstName: '',
          lastName: '',
          username: '',
          email: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it(`Should be able to update user`, async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.deleteUsers();
      await testService.addUser();
      const user = await testService.getUsers();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .put(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          firstName: 'test updated',
          lastName: 'test updated',
          username: 'test updated',
          email: 'test.updated@mail.com',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe('test updated');
      expect(response.body.data.lastName).toBe('test updated');
      expect(response.body.data.email).toBe('test.updated@mail.com');
      expect(response.body.data.username).toBe('test updated');
    });
  });

  describe('GET /api/v1/users', () => {
    it(`Should be rejected if token is missing`, async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.deleteUsers();
      await testService.addUser();
      const response = await request(app.getHttpServer()).get(`/api/v1/users`);

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined();
      expect(response.body.errors.message).toBe('Unauthorized');
    });

    it(`Should be able to get user`, async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.deleteUsers();
      await testService.addUser();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .get(`/api/v1/users`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe('test');
      expect(response.body.data.lastName).toBe('test');
      expect(response.body.data.email).toBe('test@mail.com');
      expect(response.body.data.username).toBe('test');
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it(`Should be rejected if token is missing`, async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.deleteUsers();
      await testService.addUser();
      const user = await testService.getUsers();
      const response = await request(app.getHttpServer()).delete(
        `/api/v1/users/${user.id}`,
      );

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined();
      expect(response.body.errors.message).toBe('Unauthorized');
    });

    it(`Should be able to delete user`, async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.deleteUsers();
      await testService.addUser();
      const user = await testService.getUsers();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/users/${user.id}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.firstName).toBe('test');
      expect(response.body.data.lastName).toBe('test');
      expect(response.body.data.email).toBe('test@mail.com');
      expect(response.body.data.username).toBe('test');

      const response2 = await request(app.getHttpServer())
        .get(`/api/v1/users`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`);

      logger.info(response2.body);

      expect(response2.status).toBe(404);
      expect(response2.body).toBeDefined();
      expect(response2.body.errors).toBe('User not found');
    });
  });
});
