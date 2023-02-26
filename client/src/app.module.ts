import {Module} from '@nestjs/common';
import {ConfigModule} from './modules/config/config.module';
import {BuildModule} from './modules/build/build.module';
import {HealthCheckModule} from './modules/health-check/health-check.module';
import {WebsocketModule} from './modules/websocket-client/websocket.module';
import {AppClusterService} from './app-cluster.service';

@Module({
  imports: [ConfigModule, BuildModule, HealthCheckModule, WebsocketModule],
  providers: [AppClusterService],
})
export class AppModule {}
