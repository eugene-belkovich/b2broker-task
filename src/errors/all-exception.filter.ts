import {ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus} from '@nestjs/common';

export interface ErrorInterface {
  code: number;
  message: string;
}

export const hasErrorInfo = (obj: unknown): obj is ErrorInterface => {
  return typeof (obj as ErrorInterface).code === 'number' && typeof (obj as ErrorInterface).message === 'string';
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorCode = httpStatus;
    let errorMessage;

    if (exception instanceof HttpException) {
      const resp: any = exception.getResponse();
      errorMessage = resp?.message || JSON.stringify(resp);
    }

    if (hasErrorInfo(exception)) {
      errorCode = exception.code;
      errorMessage = exception.message;
    }

    if (!errorMessage && exception instanceof Error) {
      errorMessage = exception.message;
    }

    const responseBody = {
      code: errorCode,
      message: errorMessage,
    };

    response.status(httpStatus).json(responseBody);
  }
}
