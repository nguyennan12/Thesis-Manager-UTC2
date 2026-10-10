import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { POSITIONS_KEY } from '../decorators/require-position.decorator';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { AuthenticatedUser } from '../interfaces/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPositions = this.reflector.getAllAndOverride<string[]>(
      POSITIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no restrictions are specified, allow access
    if (!requiredRoles && !requiredPositions && !requiredPermissions) {
      return true;
    }

    const { user }: { user: AuthenticatedUser } = context
      .switchToHttp()
      .getRequest();

    if (!user) {
      throw new ForbiddenException('Không xác định được thông tin người dùng.');
    }

    // Admin has full access to all system endpoints
    if (user.roles && user.roles.includes('ADMIN')) {
      return true;
    }

    // 1. Check Roles
    if (requiredRoles && requiredRoles.length > 0) {
      const hasRole = user.roles && requiredRoles.some((r) => user.roles.includes(r));
      if (!hasRole) {
        throw new ForbiddenException(
          'Bạn không có vai trò (Role) phù hợp để truy cập chức năng này.',
        );
      }
    }

    // 2. Check Positions / Scoped Roles
    if (requiredPositions && requiredPositions.length > 0) {
      const hasPosition =
        user.userRoleScopes?.some((s) => requiredPositions.includes(s.roleCode)) ||
        user.roles?.some((r) => requiredPositions.includes(r));
      if (!hasPosition) {
        throw new ForbiddenException(
          'Chức năng này yêu cầu chức vụ quản lý chuyên biệt (ví dụ: Trưởng bộ môn, Ban chủ nhiệm Khoa).',
        );
      }
    }

    // 3. Check Granular Permissions
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission =
        user.permissions &&
        requiredPermissions.every((p) => user.permissions?.includes(p));
      if (!hasPermission) {
        throw new ForbiddenException(
          'Bạn không có quyền hạn (Permission) cụ thể để thực hiện thao tác này.',
        );
      }
    }

    return true;
  }
}
