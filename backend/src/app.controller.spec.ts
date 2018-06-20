import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Res } from '@nestjs/common';
import {} from 'jest';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Welcome to Culture Events!"', () => {
      const appController = app.get<AppController>(AppController);
      const response = Res();
      expect(appController.root(response)).toBe('Welcome to Culture Events!..');
    });
  });
});
