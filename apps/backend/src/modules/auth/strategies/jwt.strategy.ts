// ==============================================================================
// PASSPORT JWT STRATEGY (Pure Redis Caching)
// ==============================================================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AUTH_COOKIES } from '../../../common/constants/system.constant';
import { AuthenticatedUser, JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { RbacCacheService } from '../services/rbac-cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly rbacCacheService: RbacCacheService,
  ) {
    const accessSecret = configService.getOrThrow<string>('jwt.accessSecret');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // 1. Trích xuất từ HttpOnly Cookie (dành cho Web Frontend - Chống XSS)
        (req: Request) => {
          return req?.cookies?.[AUTH_COOKIES.ACCESS_TOKEN] || null;
        },
        // 2. Trích xuất từ Header Authorization: Bearer <token> (dành cho Postman / Scalar / Mobile)
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: accessSecret,
    });
  }

  /**
   * Phương thức được Passport tự động gọi sau khi JWT đã được verify chữ ký và còn hạn.
   * Truy vấn trạng thái tài khoản và nạp permissions hoàn toàn từ Redis Server.
   */
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const isActive = await this.rbacCacheService.isAccountActive(payload.sub);

    if (!isActive) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại hoặc đã bị khóa quyền truy cập.',
      );
    }

    // Lấy danh sách permissions trực tiếp từ Redis Sets
    const permissions = await this.rbacCacheService.getPermissionsForRoles(payload.roles);

    return {
      ...payload,
      permissions,
    };
  }
}
