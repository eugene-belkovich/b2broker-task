import {ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger = new Logger(HttpExceptionFilter.name);

  public catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const body = exception.getResponse();

    this.logger.debug(`Http exception. Url: ${request.url}. Status: ${status}. Body: ${JSON.stringify(body)}`);

    response.status(status).json(body);
  }
}
