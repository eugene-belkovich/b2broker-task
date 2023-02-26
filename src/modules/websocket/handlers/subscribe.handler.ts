import {Injectable, Inject, Logger} from '@nestjs/common';
import {WebsocketHandler} from '../types/websocket.handler.interface';
import {ResponseMessage} from '../types';
import {ResponseType, StatusType} from '../enums';
import {WebsocketState} from '../websocket.state';
import {IWebSocketServer} from '../types/websocket-server.interface';
import {SUBSCRIBE_DELAY} from '../constants';

@Injectable()
export class SubscribeHandler implements WebsocketHandler<IWebSocketServer> {
  private readonly logger = new Logger(SubscribeHandler.name);

  constructor(
    @Inject(WebsocketState)
    private readonly state: WebsocketState,
  ) {}

  handle(websocket: IWebSocketServer): void {
    const response: ResponseMessage = this.state.subscribe(websocket.id, {
      type: ResponseType.SUBSCRIBE,
      status: StatusType.SUBSCRIBED,
      updatedAt: new Date().toISOString(),
    });

    this.logger.log('SUBSCRIBE', response);
    setTimeout(() => {
      websocket.send(JSON.stringify(response));
    }, SUBSCRIBE_DELAY);
  }
}
