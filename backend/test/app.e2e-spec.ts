import request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import 'jest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { connectionDetails } from '../src/connection';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      imports: [
        TypeOrmModule.forRoot(connectionDetails),
      ],
      providers: [AppService]
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(/^\/$/, (_, res) => {
      res.redirect('/app/');
    });
    await app.init();
  });

  it('/GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect('Found. Redirecting to /app/');
  });

  afterAll(async () => {
    await app.close();
  });
});
