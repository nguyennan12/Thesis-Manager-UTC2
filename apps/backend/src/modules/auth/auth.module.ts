// ==============================================================================
// AUTHENTICATION & DYNAMIC RBAC MODULE
// ==============================================================================

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { RolesAdminController } from './controllers/roles.admin.controller';
import { PermissionsAdminController } from './controllers/permissions.admin.controller';
import { AuthService } from './services/auth.service';
import { RolesService } from './services/roles.service';
import { PermissionsService } from './services/permissions.service';
import { RbacCacheService } from './services/rbac-cache.service';
import {
  AccountsRepository,
  RolesRepository,
  PermissionsRepository,
} from './repositories';
import {
  TokenHelper,
  AuthProfileHelper,
} from './helpers';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),
  ],
  controllers: [
    AuthController,
    RolesAdminController,
    PermissionsAdminController,
  ],
  providers: [
    // Repositories (Data Access Layer)
    AccountsRepository,
    RolesRepository,
    PermissionsRepository,
    // Helpers (Domain Transformation & Token Utils)
    TokenHelper,
    AuthProfileHelper,
    // Services (Business Logic Layer)
    AuthService,
    RolesService,
    PermissionsService,
    RbacCacheService,
    // Strategies
    JwtStrategy,
  ],
  exports: [
    AccountsRepository,
    RolesRepository,
    PermissionsRepository,
    TokenHelper,
    AuthProfileHelper,
    AuthService,
    RolesService,
    PermissionsService,
    RbacCacheService,
    JwtStrategy,
    PassportModule,
    JwtModule,
  ],
})
export class AuthModule {}
