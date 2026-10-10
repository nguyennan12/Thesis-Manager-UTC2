// ==============================================================================
// AUTHENTICATION SERVICE (SRP: Core Authentication & Token Lifecycle Orchestrator)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import { AccountsRepository } from '../repositories/accounts.repository';
import { RbacCacheService } from './rbac-cache.service';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { TokenHelper, AuthProfileHelper, AccountWithProfileRelations } from '../helpers';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { Result, AppError } from '../../../common/utils';
import {
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  LoginResponseDto,
  UserProfileDto,
} from '../dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsRepository: AccountsRepository,
    private readonly rbacCacheService: RbacCacheService,
    private readonly auditLogsService: AuditLogsService,
    private readonly tokenHelper: TokenHelper,
    private readonly authProfileHelper: AuthProfileHelper,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Đăng nhập hệ thống, cấp Access Token vào HttpOnly Cookie và Refresh Token xoay vòng
   */
  async login(
    dto: LoginDto,
    res?: Response,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Result<LoginResponseDto>> {
    const account = await this.accountsRepository.findByIdentifier(dto.username);

    if (!account) {
      return Result.fail(AppError.unauthorized('Thông tin đăng nhập không chính xác.'));
    }

    if (!account.isActive) {
      return Result.fail(
        AppError.unauthorized('Tài khoản đã bị tạm khóa. Vui lòng liên hệ quản trị viên.'),
      );
    }

    // Kiểm tra trạng thái học tập nếu là tài khoản sinh viên
    if (account.student) {
      const inactiveStatuses = ['DROPPED_OUT', 'EXPELLED', 'SUSPENDED'];
      if (inactiveStatuses.includes(account.student.status)) {
        return Result.fail(
          AppError.unauthorized('Tài khoản sinh viên đang trong trạng thái đình chỉ hoặc đã thôi học.'),
        );
      }
    }

    const isPasswordValid = await bcrypt.compare(dto.password, account.passwordHash);
    if (!isPasswordValid) {
      return Result.fail(AppError.unauthorized('Thông tin đăng nhập không chính xác.'));
    }

    // Trích xuất roles, positions và userRoleScopes qua Helper type-safe
    const { roles, positions, userRoleScopes } = this.authProfileHelper.extractRolesAndPositions(
      account as AccountWithProfileRelations,
    );

    const payload: JwtPayload = {
      sub: account.id,
      username: account.username,
      email: account.email,
      roles,
      positions,
      studentId: account.studentId || undefined,
      lecturerId: account.lecturerId || undefined,
      facultyId: account.lecturer?.department?.facultyId || undefined,
      departmentId: account.lecturer?.departmentId || undefined,
      userRoleScopes,
    };

    const accessToken = this.tokenHelper.generateAccessToken(payload);
    const refreshToken = this.tokenHelper.generateRefreshToken(payload);

    // Lưu refreshTokenHash vào DB (Thu hồi token cũ)
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await this.accountsRepository.updateLoginSession(account.id, refreshTokenHash);

    // Thiết lập Access Token vào HttpOnly Cookie
    if (res) {
      this.tokenHelper.setAccessTokenCookie(res, accessToken);
    }

    const userProfile = this.authProfileHelper.buildUserProfile(
      account as AccountWithProfileRelations,
      roles,
      positions,
      userRoleScopes,
    );

    // Ghi nhận Audit Log sự kiện đăng nhập (BR-13)
    this.auditLogsService.logEvent({
      accountId: account.id,
      action: 'AUTH_LOGIN',
      endpoint: '/api/v1/auth/login',
      httpMethod: 'POST',
      ipAddress,
      userAgent,
      responseStatus: 200,
    });

    return Result.ok({
      accessToken,
      refreshToken,
      user: userProfile,
    });
  }

  /**
   * Token Rotation: Kiểm tra refresh token, thu hồi token cũ và cấp mới
   */
  async refreshToken(
    refreshToken: string,
    res?: Response,
  ): Promise<Result<{ accessToken: string; refreshToken: string }>> {
    if (!refreshToken) {
      return Result.fail(AppError.unauthorized('Refresh token không được để trống.'));
    }

    let decoded: JwtPayload;
    try {
      const refreshSecret = this.configService.getOrThrow<string>('jwt.refreshSecret');
      decoded = this.jwtService.verify(refreshToken, { secret: refreshSecret });
    } catch {
      return Result.fail(
        AppError.unauthorized('Refresh token không hợp lệ hoặc đã hết hạn.'),
      );
    }

    const account = await this.accountsRepository.findById(decoded.sub);

    if (!account || !account.isActive || !account.refreshTokenHash) {
      return Result.fail(
        AppError.unauthorized('Phiên làm việc đã bị thu hồi. Vui lòng đăng nhập lại.'),
      );
    }

    const isMatch = await bcrypt.compare(refreshToken, account.refreshTokenHash);
    if (!isMatch) {
      // Phát hiện Replay Attack -> Thu hồi toàn bộ session
      await this.accountsRepository.updateRefreshTokenHash(account.id, null);
      await this.rbacCacheService.invalidateAccount(account.id);
      return Result.fail(
        AppError.unauthorized('Phát hiện truy cập bất thường. Phiên làm việc đã bị hủy.'),
      );
    }

    const { roles, positions, userRoleScopes } = this.authProfileHelper.extractRolesAndPositions(
      account as AccountWithProfileRelations,
    );
    const newPayload: JwtPayload = {
      sub: account.id,
      username: account.username,
      email: account.email,
      roles,
      positions,
      studentId: account.studentId || undefined,
      lecturerId: account.lecturerId || undefined,
      facultyId: account.lecturer?.department?.facultyId || undefined,
      departmentId: account.lecturer?.departmentId || undefined,
      userRoleScopes,
    };

    const newAccessToken = this.tokenHelper.generateAccessToken(newPayload);
    const newRefreshToken = this.tokenHelper.generateRefreshToken(newPayload);

    // Xoay vòng Refresh Token và cập nhật lại lastLoginAt
    const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    await this.accountsRepository.updateRefreshTokenHash(account.id, newRefreshTokenHash);

    if (res) {
      this.tokenHelper.setAccessTokenCookie(res, newAccessToken);
    }

    return Result.ok({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  }

  /**
   * Đăng xuất, hủy refreshTokenHash, xóa HttpOnly Cookie và Invalidate cache
   */
  async logout(
    accountId: string,
    res?: Response,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Result<{ message: string }>> {
    await this.accountsRepository.updateRefreshTokenHash(accountId, null);
    await this.rbacCacheService.invalidateAccount(accountId);

    if (res) {
      this.tokenHelper.clearAccessTokenCookie(res);
    }

    this.auditLogsService.logEvent({
      accountId,
      action: 'AUTH_LOGOUT',
      endpoint: '/api/v1/auth/logout',
      httpMethod: 'POST',
      ipAddress,
      userAgent,
      responseStatus: 200,
    });

    return Result.ok({ message: 'Đăng xuất thành công.' });
  }

  /**
   * Lấy hồ sơ người dùng hiện tại (chỉ thông tin, role, position)
   */
  async getProfile(accountId: string): Promise<Result<UserProfileDto>> {
    const account = await this.accountsRepository.findById(accountId);

    if (!account) {
      return Result.fail(AppError.notFound('Không tìm thấy thông tin tài khoản.'));
    }

    const { roles, positions, userRoleScopes } = this.authProfileHelper.extractRolesAndPositions(
      account as AccountWithProfileRelations,
    );
    return Result.ok(
      this.authProfileHelper.buildUserProfile(
        account as AccountWithProfileRelations,
        roles,
        positions,
        userRoleScopes,
      ),
    );
  }

  /**
   * Đổi mật khẩu tài khoản (Kiểm tra mật khẩu cũ và chặn trùng lặp, xóa cache)
   */
  async changePassword(
    accountId: string,
    dto: ChangePasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Result<{ message: string }>> {
    if (dto.newPassword === dto.oldPassword) {
      return Result.fail(
        AppError.badRequest('Mật khẩu mới không được trùng với mật khẩu hiện tại.'),
      );
    }

    const account = await this.accountsRepository.findById(accountId);
    if (!account) {
      return Result.fail(AppError.notFound('Không tìm thấy tài khoản.'));
    }

    const isMatch = await bcrypt.compare(dto.oldPassword, account.passwordHash);
    if (!isMatch) {
      return Result.fail(AppError.badRequest('Mật khẩu hiện tại không chính xác.'));
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    await this.accountsRepository.updatePassword(accountId, passwordHash);
    await this.rbacCacheService.invalidateAccount(accountId);

    this.auditLogsService.logEvent({
      accountId,
      action: 'AUTH_CHANGE_PASSWORD',
      endpoint: '/api/v1/auth/change-password',
      httpMethod: 'PATCH',
      ipAddress,
      userAgent,
      responseStatus: 200,
    });

    return Result.ok({ message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.' });
  }

  /**
   * Quên mật khẩu: Tạo Reset Token có thời hạn 15 phút
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<Result<{ message: string; resetToken?: string }>> {
    const account = await this.accountsRepository.findByEmail(dto.email);
    if (!account) {
      // Bảo mật chống Brute Force / Thu thập email: Trả về thông điệp chung
      return Result.ok({
        message: 'Nếu email tồn tại trong hệ thống, hướng dẫn khôi phục mật khẩu sẽ được gửi tới bạn.',
      });
    }

    const resetSecret = this.configService.getOrThrow<string>('jwt.accessSecret');
    const resetToken = this.jwtService.sign(
      { sub: account.id, email: account.email, type: 'RESET_PASSWORD' },
      { secret: resetSecret, expiresIn: '15m' },
    );

    return Result.ok({
      message: 'Mã xác nhận khôi phục mật khẩu đã được tạo (thời hạn 15 phút).',
      resetToken,
    });
  }

  /**
   * Đặt lại mật khẩu: Xác thực Token, ghi nhận mật khẩu mới và xóa cache
   */
  async resetPassword(
    dto: ResetPasswordDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<Result<{ message: string }>> {
    if (!dto.token) {
      return Result.fail(AppError.badRequest('Mã xác thực không được để trống.'));
    }

    try {
      const resetSecret = this.configService.getOrThrow<string>('jwt.accessSecret');
      const decoded: any = this.jwtService.verify(dto.token, { secret: resetSecret });

      if (decoded.type !== 'RESET_PASSWORD' || !decoded.sub) {
        return Result.fail(AppError.badRequest('Mã xác thực không hợp lệ.'));
      }

      const account = await this.accountsRepository.findById(decoded.sub);
      if (!account || !account.isActive) {
        return Result.fail(
          AppError.notFound('Tài khoản không tồn tại hoặc đã bị tạm khóa.'),
        );
      }

      const passwordHash = await bcrypt.hash(dto.newPassword, 10);
      await this.accountsRepository.updatePassword(account.id, passwordHash);
      await this.rbacCacheService.invalidateAccount(account.id);

      this.auditLogsService.logEvent({
        accountId: account.id,
        action: 'AUTH_RESET_PASSWORD',
        endpoint: '/api/v1/auth/reset-password',
        httpMethod: 'POST',
        ipAddress,
        userAgent,
        responseStatus: 200,
      });

      return Result.ok({
        message: 'Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.',
      });
    } catch {
      return Result.fail(
        AppError.badRequest('Mã xác thực đã hết hạn hoặc không hợp lệ.'),
      );
    }
  }
}
