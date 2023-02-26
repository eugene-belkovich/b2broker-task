import {Injectable, Inject, Logger} from '@nestjs/common';
import {WebsocketHandler} from '../types/websocket.handler.interface';
import {ResponseMessage} from '../types';
import {ResponseType, StatusType} from '../enums';
import {WebsocketState} from '../websocket.state';
import {IWebSocketServer} from '../types/websocket-server.interface';
import {UNSUBSCRIBE_DELAY} from '../constants';

@Injectable()
export class UnsubscribeHandler implements WebsocketHandler<IWebSocketServer> {
  private readonly logger = new Logger(UnsubscribeHandler.name);

  constructor(
    @Inject(WebsocketState)
    private readonly state: WebsocketState,
  ) {}

  handle(websocket: IWebSocketServer): void {
    const response: ResponseMessage = this.state.unsubscribe(websocket.id, {
      type: ResponseType.UNSUBSCRIBE,
      status: StatusType.UNSUBSCRIBED,
      updatedAt: new Date().toISOString(),
    });

    this.logger.log('UNSUBSCRIBE_DELAY', response);

    setTimeout(() => {
      websocket.send(JSON.stringify(response));
    }, UNSUBSCRIBE_DELAY);
  }
}
