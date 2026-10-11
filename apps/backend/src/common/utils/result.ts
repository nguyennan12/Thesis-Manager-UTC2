// ==============================================================================
// RESULT PATTERN (Functional Error Handling / Railway-Oriented Programming)
// ==============================================================================

import { AppError } from './app-error';

export class Result<T, E = AppError> {
  private constructor(
    public readonly isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E,
  ) {
    if (isSuccess && _error) {
      throw new Error('InvalidOperation: A successful result cannot contain an error.');
    }
    if (!isSuccess && _value !== undefined && _error === undefined) {
      throw new Error('InvalidOperation: A failed result must contain an error.');
    }
  }

  public get isFailure(): boolean {
    return !this.isSuccess;
  }

  public get value(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get the value of an error result. Use unwrap() or check isSuccess first.');
    }
    return this._value as T;
  }

  public get error(): E {
    if (this.isSuccess) {
      throw new Error('Cannot get the error of a successful result.');
    }
    return this._error as E;
  }

  /**
   * Trích xuất giá trị thành công; nếu là thất bại sẽ tự động chuyển thành HttpException ném ra ở Controller
   */
  public unwrap(): T {
    if (this.isFailure) {
      const err = this._error;
      if (err instanceof AppError) {
        throw err.toHttpException();
      }
      throw new Error(String(err));
    }
    return this._value as T;
  }

  /**
   * Pattern matching để xử lý rẽ nhánh
   */
  public match<R>(patterns: { onSuccess: (value: T) => R; onFailure: (error: E) => R }): R {
    if (this.isSuccess) {
      return patterns.onSuccess(this._value as T);
    }
    return patterns.onFailure(this._error as E);
  }

  // ==============================================================================
  // STATIC FACTORY METHODS
  // ==============================================================================

  public static ok<T, E = AppError>(value?: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  public static fail<T, E = AppError>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  public static err<T, E = AppError>(error: E): Result<T, E> {
    return Result.fail<T, E>(error);
  }
}
