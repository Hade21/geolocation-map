import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { Logger } from 'winston';
import { AppModule } from './../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('LocationsController', () => {
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

  describe('POST api/v1/units/:unitId/location', () => {
    beforeEach(async () => {
      await testService.deleteAuth();
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.deleteUsers();
      await testService.addUser();
      await testService.createUnits();
    });

    it('should be rejected if input field wrong', async () => {
      const unit = await testService.getUnits();
      const user = await testService.getUsers();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .post(`/api/v1/units/${unit.id}/location`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          long: '',
          lat: '',
          alt: '',
          location: '',
          dateTime: '',
          createdBy: user.id,
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to add new location', async () => {
      const unit = await testService.getUnits();
      const user = await testService.getUsers();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .post(`/api/v1/units/${unit.id}/location`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          long: 'test',
          lat: 'test',
          alt: 'test',
          location: 'test',
          dateTime: new Date().toISOString(),
          createdBy: user.id,
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.long).toBe('test');
      expect(response.body.data.lat).toBe('test');
      expect(response.body.data.alt).toBe('test');
      expect(response.body.data.location).toBe('test');
      expect(response.body.data.dateTime).toBeDefined();
    });
  });

  describe('GET api/v1/units/:unitId/location', () => {
    it('should be able to get all units location', async () => {
      await testService.deleteLocations();
      await testService.deleteUnits();
      await testService.createUnits();
      await testService.addLocation();
      const unit = await testService.getUnits();
      const response = await request(app.getHttpServer()).get(
        `/api/v1/units/${unit.id}/location`,
      );

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].long).toBe('test');
      expect(response.body.data[0].lat).toBe('test');
      expect(response.body.data[0].alt).toBe('test');
      expect(response.body.data[0].location).toBe('test');
      expect(response.body.data[0].dateTime).toBeDefined();
      expect(response.body.data[0].createdBy).toBeDefined();
    });
  });
});
