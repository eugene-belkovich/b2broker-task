import {ValidationPipe, Logger} from '@nestjs/common';
import {ConfigModule} from './modules/config/config.module';
import {ConfigService} from './modules/config/config.service';
import {B2brokerClientApplication} from './modules/application/b2broker-client.application';

import {AppModule} from './app.module';
import {version} from '../package.json';
import {AppClusterService} from './app-cluster.service';

const logger = new Logger();

async function bootstrap(pid: number) {
  const app = await B2brokerClientApplication.create(AppModule);

  const configService = app.select(ConfigModule).get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({transform: true}));

  const port = configService.get('PORT');

  try {
    await app.listen(pid || port);

    logger.log(`Service is up on ${port} port, version: ${version}`);
  } catch (e) {
    logger.error('Failed to up the service', e);
  }
}

//Call app-cluster.service.ts here.
AppClusterService.clusterize(bootstrap);
