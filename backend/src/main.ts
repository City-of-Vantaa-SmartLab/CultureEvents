import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();
const path = require('path');
const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useStaticAssets(path.resolve(__dirname + '/../public'));
  await app.listen(PORT);
}
bootstrap();
