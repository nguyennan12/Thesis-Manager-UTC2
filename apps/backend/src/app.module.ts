import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { PrismaModule } from './database/prisma.module';
import { RedisModule } from './database/redis/redis.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { AuthModule } from './modules/auth/auth.module';
import { AcademicModule } from './modules/academic/academic.module';
import { PositionsModule } from './modules/positions/positions.module';
import { UsersModule } from './modules/users/users.module';
import { GradingModule } from './modules/grading/grading.module';
import { DataImportModule } from './modules/data-import/data-import.module';
import { TopicsModule } from './modules/topics/topics.module';
import { RegistrationsModule } from './modules/registrations/registrations.module';
import { ProgressModule } from './modules/progress/progress.module';
import { CouncilsModule } from './modules/councils/councils.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '../../.env', '../.env'],
    }),
    PrismaModule,
    RedisModule,
    AuditLogsModule,
    AuthModule,
    AcademicModule,
    PositionsModule,
    UsersModule,
    GradingModule,
    DataImportModule,
    TopicsModule,
    RegistrationsModule,
    ProgressModule,
    CouncilsModule,
  ],
  providers: [
    // Global Authentication Guard: Secure by Default (Requires @Public() to bypass)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Dynamic RBAC & Positions Guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
