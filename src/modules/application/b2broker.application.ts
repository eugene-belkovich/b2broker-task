import {NestFactory as NestFactoryCore} from '@nestjs/core';
import {INestApplication, NestApplicationOptions} from '@nestjs/common';

import {ConfigService} from '../config/config.service';
import {UnhandledExceptionFilter} from '../../errors/unhandled-exception.filter';
import {HttpExceptionFilter} from '../../errors/http-exception.filter';
import {AllExceptionsFilter} from '../../errors/all-exception.filter';

const configService = ConfigService.getDefaultInstance();

const processCors = (app: INestApplication): void => {
  const value = configService.get('CORS_ORIGINS');
  if (!value) {
    return;
  }
  if (value === '*') {
    app.enableCors();
    return;
  }
  app.enableCors({origin: value.split(',').map((origin) => origin.trim())});
};

export class B2brokerApplication {
  public static async create(module: any, options?: NestApplicationOptions): Promise<INestApplication> {
    // We need to disable underlying platform body parser and later use custom one, but before using RequestStorageMiddleware.
    const app = await NestFactoryCore.create(module, {...options, rawBody: true});

    processCors(app);

    app.useGlobalFilters(new UnhandledExceptionFilter());
    app.useGlobalFilters(new HttpExceptionFilter(), new AllExceptionsFilter());

    return app;
  }
}
