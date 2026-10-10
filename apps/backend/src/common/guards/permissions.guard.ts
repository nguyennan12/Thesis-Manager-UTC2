// ==============================================================================
// GRANULAR PERMISSIONS GUARD
// ==============================================================================

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedUser } from '../interfaces/jwt-payload.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Nếu không yêu cầu permission cụ thể thì cho phép đi tiếp
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user }: { user: AuthenticatedUser } = context
      .switchToHttp()
      .getRequest();

    if (!user) {
      throw new ForbiddenException('Không xác định được thông tin người dùng.');
    }

    // Admin có toàn quyền hệ thống
    if (user.roles && user.roles.includes('ADMIN')) {
      return true;
    }

    const hasPermission =
      user.permissions &&
      requiredPermissions.every((p) => user.permissions?.includes(p));

    if (!hasPermission) {
      throw new ForbiddenException(
        'Bạn không có quyền hạn (Permission) cụ thể để thực hiện thao tác này.',
      );
    }

    return true;
  }
}
