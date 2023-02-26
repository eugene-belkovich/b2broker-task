import {Injectable, Inject, Logger} from '@nestjs/common';
import {ResponseType} from './enums';
import {interval, Subscription} from 'rxjs';
import {Optional} from '../../utils';
import {WebsocketState} from './websocket.state';

@Injectable()
export class WebsocketHeartbeat {
  private readonly logger = new Logger(WebsocketHeartbeat.name);

  private heartbeatInterval: Optional<Subscription> = null;

  constructor(
    @Inject(WebsocketState)
    private readonly state: WebsocketState,
  ) {}

  private sendHeartbeatAll(server: any): void {
    server.clients.forEach(function each(client: any) {
      client.send(
        JSON.stringify({
          type: ResponseType.HEARTBEAT,
          updatedAt: new Date().toISOString(),
        }),
      );
    });
  }

  startHeartbeat(server: any): void {
    if (!this.heartbeatInterval || this.heartbeatInterval.closed) {
      this.heartbeatInterval = interval(1000).subscribe((x) => {
        this.sendHeartbeatAll(server);
      });
    }
  }

  stopHeartbeat(): void {
    if (this.state.count() < 1 && !this.heartbeatInterval.closed) {
      this.heartbeatInterval.unsubscribe();
    }
  }
}
