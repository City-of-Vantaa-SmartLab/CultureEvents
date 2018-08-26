import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const bodyParser = require('body-parser');

dotenv.config();
const path = require('path');
const PORT = process.env.PORT;
const FILE_SIZE_LIMIT = process.env.FILE_SIZE_LIMIT || '5mb';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.urlencoded({
    extended: true,
    limit: FILE_SIZE_LIMIT
  }));
  app.use(/^\/$/, (req, res) => {
    res.redirect('/app/');
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
  console.log('BODY_PARSER_UPDATED');
  await app.listen(PORT);
}
bootstrap();
