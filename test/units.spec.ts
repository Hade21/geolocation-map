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
      const response = await request(app.getHttpServer())
        .post('/api/v1/units')
        .send({
          id: '',
          name: '',
          type: '',
          egi: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to create new units', async () => {
      await testService.deleteUnits();
      const response = await request(app.getHttpServer())
        .post('/api/v1/units')
        .send({
          id: 'testId',
          name: 'test',
          type: 'test',
          egi: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.id).toBe('testId');
      expect(response.body.data.name).toBe('test');
      expect(response.body.data.type).toBe('test');
      expect(response.body.data.egi).toBe('test');
    });

    it('should be rejected if units already exist', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/units')
        .send({
          id: 'testId',
          name: 'test',
          type: 'test',
          egi: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(409);
      expect(response.body).toBeDefined();
    });
  });
});
