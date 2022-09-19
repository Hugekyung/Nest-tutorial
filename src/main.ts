import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import * as path from 'path';

declare const module: any;

dotenv.config({
  path: path.resolve(process.env.NODE_ENV === 'prod' ? '.pord.env' : '.dev.env'),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || process.env.ALTER_PORT;
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(PORT);

  // Hot Module-Reloading
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
  console.log(`Started App Successfully with ${PORT} ...`);
}
bootstrap();
