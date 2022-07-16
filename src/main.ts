import 'dotenv/config'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  const config = new DocumentBuilder()
  .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'access-token',)
  .setTitle('Auth-in-coginito')
  .setDescription('user validation example in AWS cognito, users are also saved in a MongoDB database')
  .setVersion('1.0')
  .build()

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();