import { NestFactory } from '@nestjs/core';
import { RootModule } from './modules/root.module.js';
import { ValidationPipe, Logger, LogLevel } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Determine log levels based on environment
  const defaultLogLevels: LogLevel[] = ['log', 'error', 'warn'];
  let activeLogLevels: LogLevel[];

  if (
    process.env.LOG_VERBOSE === 'true' ||
    process.env.NODE_ENV === 'development'
  ) {
    activeLogLevels = [...defaultLogLevels, 'verbose', 'debug'];
  } else {
    activeLogLevels = defaultLogLevels;
  }

  const app = await NestFactory.create(RootModule, {
    logger: activeLogLevels,
  });

  console.log(process.env.NODE_ENV);

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

  app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);

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
  Logger.log(
    `Application is running on: ${await app.getUrl()}`,
    'NestApplication',
  );
  Logger.log(
    `Active log levels: ${activeLogLevels.join(', ')}`,
    'NestApplication',
  );
}
await bootstrap();
