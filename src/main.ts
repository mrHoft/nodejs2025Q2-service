import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import * as yaml from 'yamljs';
import { join } from 'path';

const PORT = parseInt(process.env.PORT || '4000', 10);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const document = yaml.load(join(__dirname, '../doc/api.yaml'));
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
}
bootstrap();
