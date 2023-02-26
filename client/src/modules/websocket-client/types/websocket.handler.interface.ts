export abstract class WebsocketHandler<T> {
  public abstract handle(payload: T): void;
}
