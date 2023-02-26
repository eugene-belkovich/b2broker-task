import {Injectable, Logger} from '@nestjs/common';
import {ResponseMessage} from './types';

@Injectable()
export class WebsocketState {
  private readonly logger = new Logger(WebsocketState.name);

  private readonly subscribers: Map<string, ResponseMessage> = new Map<string, ResponseMessage>();
  private readonly unsubscribed: Map<string, ResponseMessage> = new Map<string, ResponseMessage>();

  subscribe(connectionId: string, data: ResponseMessage): ResponseMessage {
    if (!this.isSubscriberExist(connectionId)) {
      this.subscribers.set(connectionId, data);
      return data;
    }
    return this.getSubscriberById(connectionId) || data;
  }

  unsubscribe(connectionId: string, data: ResponseMessage): ResponseMessage {
    if (this.isSubscriberExist(connectionId)) {
      this.subscribers.delete(connectionId);
      this.unsubscribed.set(connectionId, data);
      return data;
    }
    if (this.isUnsubscribedExist(connectionId)) {
      return this.unsubscribed.get(connectionId) || data;
    }
    this.unsubscribed.set(connectionId, data);
    return data;
  }

  count(): number {
    return this.subscribers.size;
  }

  isSubscriberExist(connectionId: string): boolean {
    return this.subscribers.has(connectionId);
  }

  private isUnsubscribedExist(connectionId: string): boolean {
    return this.unsubscribed.has(connectionId);
  }

  getSubscriberById(connectionId: string): ResponseMessage | undefined {
    return this.subscribers.get(connectionId);
  }
}
