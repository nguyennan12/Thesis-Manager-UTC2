import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
  const configService = app.get(ConfigService);

  // 1. Strict Environment Variables without Fallbacks
  const appUrl = configService.getOrThrow<string>('appUrl');
  const globalPrefix = configService.getOrThrow<string>('apiPrefix');
  const port = configService.getOrThrow<number>('port');

  // 2. Cookie Parser
  app.use(cookieParser());

  // 3. CORS Configuration
  const allowedOrigins = [
    appUrl,
    ...(process.env.NODE_ENV === 'production'
      ? []
      : ['http://localhost:3000', 'http://127.0.0.1:3000']),
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== 'production' &&
          (origin.startsWith('http://localhost:') ||
            origin.startsWith('http://127.0.0.1:')))
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // 4. API Global Prefix
  app.setGlobalPrefix(globalPrefix);

  // 5. Global Validation Pipe
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

  // 6. Global Interceptors & Exception Filters
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformResponseInterceptor(),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  // 7. Swagger & Scalar API Documentation
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

  // 8. Start Server
  await app.listen(port);
  logger.log(`Backend API is running on: http://localhost:${port}/${globalPrefix}`);
  logger.log(`Scalar API Docs: http://localhost:${port}/api/reference`);
  logger.log(`Swagger UI Docs: http://localhost:${port}/api/docs`);
}

bootstrap();
