import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Res } from '@nestjs/common';
import 'jest';

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
