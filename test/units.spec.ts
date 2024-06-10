import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { Logger } from 'winston';
import { AppModule } from './../src/app.module';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('UnitsController', () => {
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

  describe('POST api/v1/units', () => {
    it('should be rejected if input field wrong', async () => {
      await testService.deleteLocations();
      await testService.deleteUnits();
      await testService.deleteUsers();
      await testService.addUser();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .post('/api/v1/units')
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          id: '',
          name: '',
          type: '',
          egi: '',
          createdBy: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to create new units', async () => {
      await testService.deleteLocations();
      await testService.deleteUnits();
      await testService.deleteUsers();
      const user = await testService.addUser();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .post('/api/v1/units')
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          name: 'test',
          type: 'test',
          egi: 'test',
          createdBy: user.id,
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe('TEST');
      expect(response.body.data.type).toBe('TEST');
      expect(response.body.data.egi).toBe('TEST');
    });

    it('should be rejected if units already exist', async () => {
      const user = await testService.getUsers();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .post('/api/v1/units')
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          name: 'test',
          type: 'test',
          egi: 'test',
          createdBy: user.id,
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body).toBeDefined();
    });
  });

  describe('PUT api/v1/units/:id', () => {
    it('should be rejected if units not found', async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.createUnits();
      const user = await testService.getUsers();
      const unit = await testService.getUnits();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .put(`/api/v1/units/${unit.id + '12'}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          name: 'unit update',
          type: 'unit update',
          egi: 'unit update',
          createdBy: user.id,
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to update units name', async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.createUnits();
      const unit = await testService.getUnits();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .put(`/api/v1/units/${unit.id}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          name: 'test update',
          type: 'test',
          egi: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe('TEST UPDATE');
      expect(response.body.data.type).toBe('TEST');
      expect(response.body.data.egi).toBe('TEST');
    });

    it('should be able to update units type', async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.createUnits();
      const unit = await testService.getUnits();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .put(`/api/v1/units/${unit.id}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          name: 'test',
          type: 'test update',
          egi: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe('TEST');
      expect(response.body.data.type).toBe('TEST UPDATE');
      expect(response.body.data.egi).toBe('TEST');
    });

    it('should be able to update units egi', async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.createUnits();
      const unit = await testService.getUnits();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .put(`/api/v1/units/${unit.id}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          name: 'test',
          type: 'test',
          egi: 'test update',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.name).toBe('TEST');
      expect(response.body.data.type).toBe('TEST');
      expect(response.body.data.egi).toBe('TEST UPDATE');
    });

    it('should be rejected if input field missing', async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.createUnits();
      const unit = await testService.getUnits();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .put(`/api/v1/units/${unit.id}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`)
        .send({
          name: '',
          type: '',
          egi: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });
  });

  describe('DELETE api/v1/units/:id', () => {
    it('should be rejected if units not found', async () => {
      await testService.createUnits();
      const unit = await testService.getUnits();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/units/${unit.id + 12}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body).toBeDefined();
    });

    it('should be able to remove units', async () => {
      await testService.deleteLocations();
      await testService.deleteUnits();
      await testService.createUnits();
      const unit = await testService.getUnits();
      const token = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });
      const response = await request(app.getHttpServer())
        .delete(`/api/v1/units/${unit.id}`)
        .set('Authorization', `Bearer ${token.body.data.token.accessToken}`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe('Unit deleted successfully');

      const unitsDeleted = await request(app.getHttpServer()).get(
        `/api/v1/units/${unit.id}`,
      );

      expect(unitsDeleted.status).toBe(404);
      expect(unitsDeleted.body).toBeDefined();
    });
  });

  describe('GET api/v1/units/', () => {
    it('should be able to get all units', async () => {
      await testService.deleteLocations();
      await testService.deleteAllUnits();
      await testService.createUnits();
      const response = await request(app.getHttpServer()).get(`/api/v1/units/`);

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data[0].id).toBeDefined();
      expect(response.body.data[0].name).toBe('TEST');
      expect(response.body.data[0].type).toBe('TEST');
      expect(response.body.data[0].egi).toBe('TEST');
    });
  });
});
