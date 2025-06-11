import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { join } from 'path';
import * as yaml from 'yamljs';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './middleware/exceptionFilter';

const PORT = parseInt(process.env.APP_PORT || '4000', 10);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const exceptionFilter = new GlobalExceptionFilter();
  app.useGlobalFilters(exceptionFilter);

  process.on('uncaughtException', err => {
    exceptionFilter.logError(err);
    setTimeout(() => process.exit(1), 1000);
  });

  process.on('unhandledRejection', reason => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    exceptionFilter.logError(err);
  });

  const document = yaml.load(join(process.cwd(), 'doc/api.yaml'));
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
  console.log(`Nest server started at ${PORT} port.`);
}
bootstrap();
