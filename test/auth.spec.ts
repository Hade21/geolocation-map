import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { Logger } from 'winston';
import { AppModule } from './../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('AuthController', () => {
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

  describe('POST api/v1/auth/register', () => {
    beforeEach(async () => {
      await testService.deleteLocations();
      await testService.deleteUnits();
      await testService.deleteUsers();
    });
    it('should be rejected if input field wrong', async () => {
      await testService.deleteUsers();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to register new user', async () => {
      await testService.deleteUsers();
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: 'test',
          firstName: 'test',
          lastName: 'test',
          email: 'test@mail.com',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.firstName).toBe('test');
      expect(response.body.data.lastName).toBe('test');
      expect(response.body.data.email).toBe('test@mail.com');
    });
  });

  describe('POST api/v1/auth/login', () => {
    beforeEach(async () => {
      await testService.deleteLocations();
      await testService.deleteUnits();
      await testService.deleteUsers();
      await testService.addUser();
    });
    it('should be rejected if input field wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.token.accessToken).toBeDefined();
      expect(response.body.data.token.refreshToken).toBeDefined();
    });
  });
});
