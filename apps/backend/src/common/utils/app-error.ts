// ==============================================================================
// APPLICATION DOMAIN ERROR (Result Pattern Error Model)
// ==============================================================================

import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

export class AppError {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = HttpStatus.BAD_REQUEST,
    public readonly code?: string,
    public readonly details?: any,
  ) {}

  /**
   * Chuyển đổi AppError thành NestJS HttpException tương ứng ở Controller
   */
  toHttpException(): HttpException {
    switch (this.statusCode) {
      case HttpStatus.BAD_REQUEST:
        return new BadRequestException({
          message: this.message,
          code: this.code,
          details: this.details,
        });
      case HttpStatus.UNAUTHORIZED:
        return new UnauthorizedException({
          message: this.message,
          code: this.code,
        });
      case HttpStatus.FORBIDDEN:
        return new ForbiddenException({
          message: this.message,
          code: this.code,
        });
      case HttpStatus.NOT_FOUND:
        return new NotFoundException({
          message: this.message,
          code: this.code,
        });
      case HttpStatus.CONFLICT:
        return new ConflictException({
          message: this.message,
          code: this.code,
        });
      case HttpStatus.INTERNAL_SERVER_ERROR:
      default:
        return new InternalServerErrorException({
          message: this.message,
          code: this.code,
          details: this.details,
        });
    }
  }

  // ==============================================================================
  // STATIC FACTORY METHODS (Tạo nhanh lỗi chuẩn không cần new)
  // ==============================================================================

  static badRequest(message: string, code?: string, details?: any): AppError {
    return new AppError(message, HttpStatus.BAD_REQUEST, code, details);
  }

  static unauthorized(message: string, code?: string): AppError {
    return new AppError(message, HttpStatus.UNAUTHORIZED, code);
  }

  static forbidden(message: string, code?: string): AppError {
    return new AppError(message, HttpStatus.FORBIDDEN, code);
  }

  static notFound(message: string, code?: string): AppError {
    return new AppError(message, HttpStatus.NOT_FOUND, code);
  }

  static conflict(message: string, code?: string): AppError {
    return new AppError(message, HttpStatus.CONFLICT, code);
  }

  static internal(message: string = 'Đã xảy ra lỗi nội bộ máy chủ.', code?: string, details?: any): AppError {
    return new AppError(message, HttpStatus.INTERNAL_SERVER_ERROR, code, details);
  }
}
