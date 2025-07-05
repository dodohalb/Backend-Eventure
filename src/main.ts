process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { EventRepo } from './repository/event.repo';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {logger: ['error', 'warn', 'log']});
  console.log('Starting the application...');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, 
      transformOptions: { enableImplicitConversion: true },
    }),
  );


  await app.listen(process.env.PORT ?? 3000);


}
bootstrap();
