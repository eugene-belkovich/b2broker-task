import {Test, TestingModule} from '@nestjs/testing';
import request from 'supertest';
import {HealthCheckModule} from '../src/modules/health-check/health-check.module';

describe('Health (e2e)', () => {
  let app: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthCheckModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('/health-check (GET)', async () => {
    await request(app.getHttpServer()).get('/health-check').expect(200).expect('OK');
  });
});
