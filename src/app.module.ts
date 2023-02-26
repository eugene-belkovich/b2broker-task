import {Module} from '@nestjs/common';
import {ConfigModule} from './modules/config/config.module';
import {BuildModule} from './modules/build/build.module';
import {HealthCheckModule} from './modules/health-check/health-check.module';
import {WebsocketModule} from './modules/websocket/websocket.module';

@Module({
  imports: [ConfigModule, BuildModule, HealthCheckModule, WebsocketModule],
})
export class AppModule {}
