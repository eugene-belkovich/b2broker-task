import {Test, TestingModule} from '@nestjs/testing';
import {WebsocketModule} from '../src/modules/websocket/websocket.module';
import {WebsocketGateway} from '../src/modules/websocket/websocket.gateway';
import {convertToString, createSocketClient, waitForSocketState} from './utils';
import {ResponseMessage} from '../src/modules/websocket/types';
import {ErrorType, ResponseType} from '../src/modules/websocket/enums';

const PORT = 443;

const brokenJsonMessage = '{broken json}';
const noMethodMessage = `{"type": "NotExistingMethod"}`;
const subscribeMessage = `{"type": "Subscribe"}`;
const unsubscribeMessage = `{"type": "Unsubscribe"}`;
const countMessage = `{"type": "CountSubscribers"}`;

describe('WebSocket Server', () => {
  let app;
  let websocketGateway;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WebsocketModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    websocketGateway = moduleFixture.get<WebsocketGateway>(WebsocketGateway);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('should be defined', () => {
    expect(websocketGateway).toBeDefined();
  });

  test('should return error with correct message on broken json', async () => {
    const [client, messages] = await createSocketClient(PORT, 1);

    client.send(brokenJsonMessage);

    await waitForSocketState(client, client.CLOSED);

    const [responseMessage] = messages;

    const json = JSON.parse(responseMessage.toString());
    const actual = {type: json.type, error: json.error};

    const expected = {
      type: ResponseType.ERROR,
      error: ErrorType.JSON_VALIDATION_ERROR,
    };

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });

  test('should return error with correct message on not existing method', async () => {
    const [client, messages] = await createSocketClient(PORT, 1);

    client.send(noMethodMessage);

    await waitForSocketState(client, client.CLOSED);

    const [responseMessage] = messages;

    const json = JSON.parse(responseMessage.toString());
    const actual = {type: json.type, error: json.error};

    const expected = {
      type: ResponseType.ERROR,
      error: ErrorType.NO_METHOD_EXIST_ERROR,
    };

    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  });

  test('should return heartbeat events', async () => {
    const [client, messages] = await createSocketClient(PORT, 3);

    await waitForSocketState(client, client.CLOSED);

    const json: any[] = convertToString(messages);

    const expected = {
      type: ResponseType.HEARTBEAT,
    };

    const actual = json.reduce((acc, item) => {
      return acc + (item.type === expected.type ? 1 : 0);
    }, 0);

    expect(actual).toBe(messages.length);
  });

  test('should return 0 subscriber on CountSubscriber event', async () => {
    const [client, messages] = await createSocketClient(443, 8);

    client.send(subscribeMessage);
    client.send(unsubscribeMessage);
    client.send(countMessage);

    await waitForSocketState(client, client.CLOSED);

    const json: ResponseMessage[] = convertToString(messages);

    const expected = {
      type: 'Subscribe',
    };
    const expectedUnsub = {
      type: 'Subscribe',
    };
    const expectedCount = {
      type: 'CountSubscribers',
      count: 0,
    };

    const actual = json.filter((item) => item.type === expected.type);
    const actualUnsub = json.filter((item) => item.type === expectedUnsub.type);
    const actualCount = json.filter((item) => item.type === expectedCount.type);

    expect(actual.length).toBe(1);
    expect(actualUnsub.length).toBe(1);
    expect(actualCount.length).toBe(1);
    expect(actualCount[0].count).toBe(expectedCount.count);
  });

  test('should return 1 subscriber on CountSubscriber event', async () => {
    const [client, messages] = await createSocketClient(443, 6);

    client.send(subscribeMessage);
    client.send(countMessage);

    await waitForSocketState(client, client.CLOSED);

    const json: ResponseMessage[] = convertToString(messages);

    const expected = {
      type: 'Subscribe',
    };
    const expectedCount = {
      type: 'CountSubscribers',
      count: 1,
    };

    const actual = json.filter((item) => item.type === expected.type);
    const actualCount = json.filter((item) => item.type === expectedCount.type);

    expect(actual.length).toBe(1);
    expect(actualCount.length).toBe(1);
    expect(actualCount[0].count).toBe(expectedCount.count);
  });

  test('should return 1 subscriber on CountSubscriber event (idempotency)', async () => {
    const [client, messages] = await createSocketClient(443, 6);

    client.send(subscribeMessage);
    client.send(subscribeMessage);
    client.send(subscribeMessage);
    client.send(unsubscribeMessage);
    client.send(countMessage);

    await waitForSocketState(client, client.CLOSED);

    const json: ResponseMessage[] = convertToString(messages);

    const expected = {
      type: 'Subscribe',
    };
    const expectedCount = {
      type: 'CountSubscribers',
      count: 1,
    };

    const actual = json.filter((item) => item.type === expected.type);
    const actualCount = json.filter((item) => item.type === expectedCount.type);

    expect(actual.length).toBe(3);
    expect(actualCount[0].count).toBe(expectedCount.count);
  });

  test('should return 2 subscriber on CountSubscriber event (idempotency)', async () => {
    const [client, messages] = await createSocketClient(443, 6);

    client.send(subscribeMessage);
    client.send(subscribeMessage);
    client.send(countMessage);

    await waitForSocketState(client, client.CLOSED);

    const json: ResponseMessage[] = convertToString(messages);

    const expected = {
      type: 'Subscribe',
    };
    const expectedCount = {
      type: 'CountSubscribers',
      count: 2,
    };

    const actual = json.filter((item) => item.type === expected.type);
    const actualCount = json.filter((item) => item.type === expectedCount.type);

    expect(actual.length).toBe(2);
    expect(actualCount.length).toBe(1);
    expect(actualCount[0].count).toBe(expectedCount.count);
  });
});

//---
// unsubscribe: unsub + , 2 unsub same, unsub + sub, unsub + sub + unsub,
// heartbeat: 1 con+, 2 con, 1 con + 1 discon, 2 con + 1 discon

//+++
// subscribe: sub+,2 sub same+,  sub + unsub +, sub + unsub + sub +,
// countSubscribe: count+, sub + count+, sub + unsub + count +
// +error method
// +error json
