import {Test, TestingModule} from '@nestjs/testing';
import {WebsocketState} from './websocket.state';

describe('WebsocketState tests', () => {
  let websocketState: WebsocketState;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebsocketState],
    }).compile();

    websocketState = module.get<WebsocketState>(WebsocketState);
  });

  test('should be defined', () => {
    expect(websocketState).toBeDefined();
  });

  test('should be empty', () => {
    expect(websocketState.count()).toBe(0);
  });

  test('should have one subscriber exist', () => {
    websocketState.subscribe('test', 'test');

    expect(websocketState.count()).toBe(1);
    expect(websocketState.isSubscriberExist('test')).toBe(true);
    expect(websocketState.getSubscriberById('test')).toBe('test');
  });

  test('should have indenpotent state on subscribe', () => {
    websocketState.subscribe('test', 'test');
    websocketState.subscribe('test', 'test1');
    websocketState.subscribe('test', 'test2');

    expect(websocketState.count()).toBe(1);
    expect(websocketState.isSubscriberExist('test')).toBe(true);
    expect(websocketState.getSubscriberById('test')).toBe('test');
  });

  test('should have indenpotent state on unsubscribe', () => {
    expect(websocketState.count()).toBe(0);

    const response = websocketState.unsubscribe('test', 'test');
    expect(websocketState.count()).toBe(0);
    expect(response).toBe('test');

    const response1 = websocketState.unsubscribe('test', 'test1');
    expect(websocketState.count()).toBe(0);
    expect(response1).toBe('test');

    websocketState.subscribe('test2', 'test2');
    const response2 = websocketState.unsubscribe('test2', 'test2');
    expect(websocketState.count()).toBe(0);
    expect(response2).toBe('test2');
  });

  test('should have zero subscribers', () => {
    websocketState.subscribe('test', 'test');
    websocketState.unsubscribe('test', 'test');

    expect(websocketState.count()).toBe(0);
    expect(websocketState.isSubscriberExist('test')).toBe(false);
    expect(websocketState.getSubscriberById('test')).toBeFalsy();
  });

  test('should have one subscribers', () => {
    websocketState.subscribe('test', 'test');
    websocketState.subscribe('test', 'test');
    websocketState.unsubscribe('test', 'test');
    websocketState.subscribe('test', 'test');
    websocketState.subscribe('test', 'test');

    expect(websocketState.count()).toBe(1);
  });

  test('should have two subscribers', () => {
    websocketState.subscribe('test', 'test');
    websocketState.subscribe('test', 'test');
    websocketState.unsubscribe('test', 'test');
    websocketState.subscribe('test', 'test');
    websocketState.subscribe('test1', 'test1');

    expect(websocketState.count()).toBe(2);
  });
});
