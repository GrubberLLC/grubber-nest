import { NestFactory } from '@nestjs/core';
import { RootModule } from './modules/root.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(RootModule);

  app.enableCors({
    origin: 'https://grubber.github.io',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Set up Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Grubber API')
    .setDescription('The Grubber API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Custom Swagger UI options to hide schemas
  const customOptions = {
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // Hide the models/schemas section
    },
  };

  SwaggerModule.setup('api', app, document, customOptions);

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
