import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();
const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
}
bootstrap();
