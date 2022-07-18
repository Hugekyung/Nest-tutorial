import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import 'dotenv/config';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({
  path: path.resolve(process.env.NODE_ENV === 'pord' ? '.pord.env' : '.dev.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || process.env.ALTER_PORT;
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  console.log(`Started App Successfully with ${PORT} ...`);
}
bootstrap();
