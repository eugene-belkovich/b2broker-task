import {RequestType, WebsocketEvent} from './enums';
import {WebSocketServer, Data} from 'ws';
import {Inject, Logger} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import {RequestMessage} from './types';
import {isValidJSONResponse} from '../../utils';
import {WebsocketState} from './websocket.state';
import {IWebSocketServer} from './types/websocket-server.interface';
import {
  CountSubscribersHandler,
  SubscribeHandler,
  UnsubscribeHandler,
  NoMethodExistHandler,
  JsonValidationHandler,
} from './handlers';
import {WebsocketHeartbeat} from './websocket-heartbeat';

export class WebsocketGateway {
  private readonly logger = new Logger(WebsocketGateway.name);

  private server = null;

  constructor(
    @Inject(WebsocketState)
    private readonly state: WebsocketState,
    @Inject(CountSubscribersHandler)
    private readonly countSubscribersHandler: CountSubscribersHandler,
    @Inject(SubscribeHandler)
    private readonly subscribeHandler: SubscribeHandler,
    @Inject(UnsubscribeHandler)
    private readonly unsubscribeHandler: UnsubscribeHandler,
    @Inject(NoMethodExistHandler)
    private readonly noMethodExistHandler: NoMethodExistHandler,
    @Inject(JsonValidationHandler)
    private readonly jsonValidationHandler: JsonValidationHandler,
    @Inject(WebsocketHeartbeat)
    private readonly websocketHeartbeat: WebsocketHeartbeat,
  ) {
    this.initServer();
  }

  private initServer() {
    this.server = new WebSocketServer({port: 443});
    this.logger.log('WssGateway: WebSocketServer is started');

    this.server.on(WebsocketEvent.CONNECTION, (websocket: IWebSocketServer) => {
      websocket.id = uuidv4();
      this.onConnection(websocket.id);
      websocket.on(WebsocketEvent.CLOSE, () => this.onClose(websocket.id));
      websocket.on(WebsocketEvent.ERROR, () => this.onError(websocket.id));
      websocket.on(WebsocketEvent.MESSAGE, (data) => this.onMessage(websocket, websocket.id, data));
    });
  }

  onConnection(connectionId?: string): void {
    this.logger.log(`WssGateway: new connection established - id: ${connectionId}`);

    this.websocketHeartbeat.startHeartbeat(this.server);
  }

  onClose(connectionId?: string): void {
    this.logger.log(`WssGateway: connection closed - id: ${connectionId}`);

    this.websocketHeartbeat.stopHeartbeat();
  }

  onError(connectionId?: string): void {
    this.logger.log(`WssGateway: error occurred - id: ${connectionId}`);
  }

  onMessage(websocket, connectionId?: string, data?: Data): void {
    const message = data.toString();

    if (!isValidJSONResponse(message)) {
      this.jsonValidationHandler.handle(websocket);
      return;
    }
    const request: RequestMessage = this.parseMessage(message);

    this.routeRequest(websocket, connectionId, request);
  }

  private parseMessage(message): RequestMessage {
    const json = JSON.parse(message);
    return {type: json.type, data: json.data} as RequestMessage;
  }

  private routeRequest(websocket, connectionId: string, request: RequestMessage): void {
    switch (request.type) {
      case RequestType.SUBSCRIBE:
        this.subscribeHandler.handle(websocket);
        break;
      case RequestType.UNSUBSCRIBE:
        this.unsubscribeHandler.handle(websocket);
        break;
      case RequestType.COUNT_SUBSCRIBERS:
        this.countSubscribersHandler.handle(websocket);
        break;
      default:
        this.noMethodExistHandler.handle(websocket);
        break;
    }
  }
}
