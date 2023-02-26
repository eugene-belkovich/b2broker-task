import * as WebSocket from 'ws';

export interface IWebSocketServer extends WebSocket {
  id?: string;
}
