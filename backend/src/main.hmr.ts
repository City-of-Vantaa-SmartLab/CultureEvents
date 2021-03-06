import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const PORT = process.env.PORT;
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
