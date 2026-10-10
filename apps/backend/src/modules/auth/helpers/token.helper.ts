// ==============================================================================
// TOKEN HELPER (JWT Generation & Cookie Management)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AUTH_COOKIES } from '../../../common/constants/system.constant';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';

@Injectable()
export class TokenHelper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Tạo Access Token (15 phút)
   */
  generateAccessToken(payload: JwtPayload): string {
    const accessSecret = this.configService.getOrThrow<string>('jwt.accessSecret');
    const accessExpiresIn = this.configService.getOrThrow<string>('jwt.accessExpiresIn');
    return this.jwtService.sign(payload, {
      secret: accessSecret,
      expiresIn: accessExpiresIn,
    });
  }

  /**
   * Tạo Refresh Token (7 ngày)
   */
  generateRefreshToken(payload: JwtPayload): string {
    const refreshSecret = this.configService.getOrThrow<string>('jwt.refreshSecret');
    const refreshExpiresIn = this.configService.getOrThrow<string>('jwt.refreshExpiresIn');
    return this.jwtService.sign(
      { sub: payload.sub },
      { secret: refreshSecret, expiresIn: refreshExpiresIn },
    );
  }

  /**
   * Thiết lập Access Token vào HttpOnly Cookie
   */
  setAccessTokenCookie(res: Response, token: string): void {
    const isProd = this.configService.getOrThrow<string>('nodeEnv') === 'production';
    res.cookie(AUTH_COOKIES.ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });
  }

  /**
   * Xóa HttpOnly Cookie khi logout
   */
  clearAccessTokenCookie(res: Response): void {
    res.clearCookie(AUTH_COOKIES.ACCESS_TOKEN, {
      httpOnly: true,
      path: '/',
    });
  }
}
