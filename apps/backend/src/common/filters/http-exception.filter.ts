import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Lỗi hệ thống nội bộ (Internal Server Error)';
    let errorDetails: any = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'object' && res !== null) {
        message = (res as any).message || (res as any).error || exception.message;
        errorDetails = (res as any).errorDetails || null;
      } else {
        message = res as string;
      }
    } else if (exception && typeof exception === 'object' && 'code' in exception) {
      // Prisma errors handling
      const prismaError = exception as any;
      if (prismaError.code === 'P2002') {
        status = HttpStatus.CONFLICT;
        const target = prismaError.meta?.target ? ` (${prismaError.meta.target})` : '';
        message = `Dữ liệu đã tồn tại trong hệ thống${target}. Vui lòng kiểm tra lại.`;
      } else if (prismaError.code === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        message = 'Không tìm thấy bản ghi tương ứng.';
      } else if (prismaError.code === 'P2003') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Ràng buộc khóa ngoại không hợp lệ hoặc dữ liệu liên kết không tồn tại.';
      }
    }

    this.logger.error(
      `[${request.method}] ${request.url} - Status: ${status} - Error: ${JSON.stringify(
        message,
      )}`,
    );

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message,
      errors: Array.isArray(message) ? message : undefined,
      errorDetails,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
