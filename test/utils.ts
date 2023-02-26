import {map} from 'lodash';
import WebSocket, {Data} from 'ws';

async function createSocketClient(port: number, closeAfter?: number): Promise<[WebSocket, Data[]]> {
  const client = new WebSocket(`ws://localhost:${port}`);
  await waitForSocketState(client, client.OPEN);
  const messages: WebSocket.Data[] = [];

  client.on('message', (data) => {
    messages.push(data);

    if (messages.length === closeAfter) {
      client.close();
    }
  });

  return [client, messages];
}

function waitForSocketState(socket: WebSocket, state: number): Promise<void> {
  return new Promise(function (resolve) {
    setTimeout(function () {
      if (socket.readyState === state) {
        resolve();
      } else {
        waitForSocketState(socket, state).then(resolve);
      }
    });
  });
}

function convertToString(messages: Data[]): any[] {
  return map(messages, (message) => JSON.parse(message.toString()));
}

export {createSocketClient, waitForSocketState, convertToString};
