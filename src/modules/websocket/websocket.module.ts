import {Module} from '@nestjs/common';
import {WebsocketGateway} from './websocket.gateway';
import * as WebSocketHandlers from './handlers';
import {WebsocketState} from './websocket.state';
import {WebsocketHeartbeat} from './websocket-heartbeat';

@Module({
  providers: [WebsocketGateway, WebsocketState, WebsocketHeartbeat, ...Object.values(WebSocketHandlers)],
})
export class WebsocketModule {}
