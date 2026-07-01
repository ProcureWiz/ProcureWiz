import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<{ status: (code: number) => { send: (body: unknown) => void } }>();
    const request = ctx.getRequest<{ method: string; url: string; id?: string }>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorPayload = this.toErrorPayload(exception, status);

    this.logger.error(
      JSON.stringify({
        event: 'http.exception',
        method: request.method,
        url: request.url,
        status,
        code: errorPayload.code,
        message: errorPayload.message,
        requestId: request.id,
      }),
    );

    response.status(status).send({
      success: false,
      error: errorPayload,
    });
  }

  private toErrorPayload(
    exception: unknown,
    status: number,
  ): {
    code: string;
    message: string;
  } {
    if (exception instanceof HttpException) {
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        return {
          code: this.httpCode(status),
          message: payload,
        };
      }

      if (typeof payload === 'object' && payload !== null) {
        const value = payload as { message?: string | string[]; error?: string };
        const normalizedMessage = Array.isArray(value.message)
          ? value.message.join(', ')
          : (value.message ?? value.error ?? exception.message);

        return {
          code: this.httpCode(status),
          message: normalizedMessage,
        };
      }

      return {
        code: this.httpCode(status),
        message: exception.message,
      };
    }

    if (exception instanceof Error) {
      return {
        code: this.httpCode(status),
        message: exception.message,
      };
    }

    return {
      code: this.httpCode(status),
      message: 'Internal server error',
    };
  }

  private httpCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'RATE_LIMITED';
      default:
        return status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'HTTP_ERROR';
    }
  }
}
