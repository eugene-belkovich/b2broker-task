import {Injectable, Inject, Logger} from '@nestjs/common';
import {WebsocketHandler} from '../types/websocket.handler.interface';
import {ResponseMessage} from '../types';
import {ResponseType} from '../enums';
import {WebsocketState} from '../websocket.state';
import {IWebSocketServer} from '../types/websocket-server.interface';

@Injectable()
export class CountSubscribersHandler implements WebsocketHandler<IWebSocketServer> {
  private readonly logger = new Logger(CountSubscribersHandler.name);

  constructor(
    @Inject(WebsocketState)
    private readonly state: WebsocketState,
  ) {}

  handle(websocket: IWebSocketServer): void {
    const response: ResponseMessage = {
      type: ResponseType.COUNT_SUBSCRIBERS,
      count: this.state.count(),
      updatedAt: new Date().toISOString(),
    };

    this.logger.log('COUNT_SUBSCRIBERS', response);
    websocket.send(JSON.stringify(response));
  }
}
