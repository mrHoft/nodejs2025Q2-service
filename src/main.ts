import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { join } from 'path';
import * as yaml from 'yamljs';
import { AppModule } from './app.module';

const PORT = parseInt(process.env.APP_PORT || '4000', 10);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const document = yaml.load(join(process.cwd(), 'doc/api.yaml'));
  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);
  console.log(`Nest server started at ${PORT} port.`)
}
bootstrap();
