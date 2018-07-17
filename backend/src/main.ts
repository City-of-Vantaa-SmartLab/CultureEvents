import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
dotenv.config();
const path = require('path');
const PORT = process.env.PORT;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(/^\/$/, (req, res) => {
    res.redirect('/app/');
  });

  app.setGlobalPrefix('api');

  app.use('/app/**', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });

  const options = new DocumentBuilder()
    .setTitle('Vantaa Culture Events')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('events')
    .addTag('reservations')
    .addTag('auth')
    .addTag('user')
    .addTag('payments')
    .addTag('fileupload')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(PORT);
}
bootstrap();
