import {WebsocketEvent} from './enums';
import WebSocket from 'ws';
import {Logger} from '@nestjs/common';
import {v4 as uuidv4} from 'uuid';
import {getRandomInt} from '../../utils';
import {interval} from 'rxjs';

export class WebsocketGateway {
  private readonly logger = new Logger(WebsocketGateway.name);

  private client = null;
  private clientId = null;

  constructor(

  ) {
    this.initClient();
  }

  private initClient() {
    this.client = new WebSocket('ws://localhost:443');
    this.logger.log('WebsocketGateway: WebSocketClient is started');

    this.clientId = uuidv4();

    this.client.on(WebsocketEvent.ERROR, () => this.onError());
    this.client.on(WebsocketEvent.CLOSE, () => this.onClose());
    this.client.on(WebsocketEvent.MESSAGE, (data) => this.onMessage(data));
    this.client.on(WebsocketEvent.OPEN, () => this.onOpen());
  }

  onError(): void {
    this.logger.log(`WebsocketGateway: error occurred - id: ${this.clientId}`);
  }

  onClose(): void {
    this.logger.log(`WebsocketGateway: connection closed - id: ${this.clientId}`);
  }

  onMessage(data): void {
    this.logger.verbose(`WebsocketGateway: message received - id: ${this.clientId} ${data}`);
  }

  onOpen(): void {
    this.logger.log(`WebsocketGateway: new connection open - id: ${this.clientId}`);

    interval(2000).subscribe((randomNumber) => {
      this.routeRequest(getRandomInt(5));
    });
  }

  private routeRequest(type: number) {
    switch (type) {
      case 0:
        this.client.send('{"type":"Subscribe"}');
        break;
      case 1:
        this.client.send('{"type":"Unsubscribe"}');
        break;
      case 2:
        this.client.send('{"type":"CountSubscribers"}');
        break;
      case 3:
        this.client.send('{"type":"WrongMethod"}');
        break;
      case 4:
        this.client.send('{broken json}');
        break;
      default:
        break;
    }
  }
}
