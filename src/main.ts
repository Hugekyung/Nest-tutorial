import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || process.env.ALTER_PORT;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
