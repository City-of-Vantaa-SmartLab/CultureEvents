import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(/^\/$/, (_, res) => {
    res.redirect('/app/');
  });
  await app.listen(PORT);
}
bootstrap();
