import {Injectable, Inject, Logger} from '@nestjs/common';
import {WebsocketHandler} from '../types/websocket.handler.interface';
import {ResponseMessage} from '../types';
import {ErrorType, ResponseType, StatusType} from '../enums';
import {WebsocketState} from '../websocket.state';
import {IWebSocketServer} from '../types/websocket-server.interface';

@Injectable()
export class NoMethodExistHandler implements WebsocketHandler<IWebSocketServer> {
  private readonly logger = new Logger(NoMethodExistHandler.name);

  constructor(
    @Inject(WebsocketState)
    private readonly state: WebsocketState,
  ) {}

  handle(websocket: IWebSocketServer): void {
    const response: ResponseMessage = {
      type: ResponseType.ERROR,
      error: ErrorType.NO_METHOD_EXIST_ERROR,
      updatedAt: new Date().toISOString(),
    };

    this.logger.log('NO_METHOD_EXIST_ERROR', response);
    websocket.send(JSON.stringify(response));
  }
}
