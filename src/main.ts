import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization', 'Content-Type'],
      origin: true,
    },
  });

  const config = new DocumentBuilder()
    .setTitle('NodeJS twitch game app')
    .addSecurity('ApiKeyAuth', {
      type: 'apiKey',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'authorization',
      description: 'JWT token',
    })
    .addSecurityRequirements('ApiKeyAuth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-explorer', app, document);

  await app.listen(3000);
}
bootstrap();
