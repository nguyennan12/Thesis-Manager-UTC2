import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // 1. Cookie Parser
  app.use(cookieParser());

  // 2. CORS Configuration
  app.enableCors({
    origin: process.env.APP_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // 3. API Global Prefix
  const globalPrefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  // 4. Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 5. Global Interceptors & Exception Filters
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // 6. Swagger & Scalar API Documentation
  const config = new DocumentBuilder()
    .setTitle('UTC2 Thesis Management API')
    .setDescription('Tài liệu API Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('access_token')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar Modern API Documentation UI
  app.use(
    '/api/reference',
    apiReference({
      spec: {
        content: document,
      },
      theme: 'purple',
      darkMode: true,
    }),
  );

  // Swagger UI (Classic)
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // 7. Start Server
  const port = process.env.PORT || 8000;
  await app.listen(port);
  logger.log(`🚀 Backend API is running on: http://localhost:${port}/${globalPrefix}`);
  logger.log(`📚 Scalar API Docs: http://localhost:${port}/api/reference`);
  logger.log(`📚 Swagger UI Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
