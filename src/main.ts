import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'debug'],
  });
  /*
    Globa USE ValidationPipe without use it inline Body()
    BUT you cant use ValidationPipe {group:[]}
  */
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
