import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || 200;

    return next.handle().pipe(
      map((resData) => {
        // If response is already formatted with message/data/meta
        if (
          resData &&
          typeof resData === 'object' &&
          'data' in resData &&
          ('message' in resData || 'meta' in resData)
        ) {
          return {
            success: true,
            statusCode,
            message: resData.message || 'Thao tác thành công',
            data: resData.data,
            meta: resData.meta,
            timestamp: new Date().toISOString(),
          };
        }

        return {
          success: true,
          statusCode,
          message: 'Thao tác thành công',
          data: resData,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
