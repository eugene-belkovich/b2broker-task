import {ExceptionFilter, Catch, ArgumentsHost, Logger, HttpStatus} from '@nestjs/common';

export class ServiceResponse<T> {
  public code: HttpStatus;
  public data: T;
  public message?: string;
  public details: any;
  public constructor(code, data: T, message?: string, details?: any) {
    this.code = code;
    this.data = data;
    this.message = message;
    this.details = details;
  }
}

@Catch()
export class UnhandledExceptionFilter implements ExceptionFilter {
  private logger = new Logger(UnhandledExceptionFilter.name);

  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const body = new ServiceResponse(HttpStatus.INTERNAL_SERVER_ERROR, undefined, 'INTERNAL_SERVER_ERROR', undefined);

    const logMessage = `Unhandled exception. Url: ${request.url}. Status: ${
      HttpStatus.INTERNAL_SERVER_ERROR
    }. Body: ${JSON.stringify(body)}`;
    this.logger.error(logMessage, exception.stack);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(body);
  }
}
