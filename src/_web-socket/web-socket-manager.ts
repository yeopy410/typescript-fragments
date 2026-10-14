import Publisher from '../utils/publisher.js';
import type { Subscribable } from '../utils/publisher.js';



type WebSocketEvents = {
  readonly open: Subscribable<Event>;
  readonly close: Subscribable<CloseEvent>;
  readonly error: Subscribable<Event>;
  readonly message: Subscribable<MessageEvent>;
}



export default class WebSocketManager {
  #url: string;
  #protocols: string | string[] | undefined;
  #socket: WebSocket;
  #reconnectRequested = false;

  #publishers = {
    open: new Publisher<Event>(),
    close: new Publisher<CloseEvent>(),
    error: new Publisher<Event>(),
    message: new Publisher<MessageEvent>(),
  }
  public readonly events: WebSocketEvents = this.#publishers;



  constructor(url: string, protocols?: string | string[]) {
    this.#url = url;
    this.#protocols = protocols;
    this.#socket = this.#createSocket();

    this.events.close.subscribe(() => {
      if (this.#reconnectRequested) {
        this.reconnect();
      }
    });
  }



  get readyState(): WebSocket['readyState'] {
    return this.#socket.readyState;
  }

  get isOpen() {
    return this.#socket.readyState === WebSocket.OPEN;
  }

  send(data: string | BufferSource | Blob) {
    if (!this.isOpen) {
      throw new Error('WebSocket is not open.');
    }
    this.#socket.send(data);
  }

  reconnect() {
    if (this.#socket.readyState === WebSocket.CLOSED) {
      this.#reconnectRequested = false;
      this.#socket = this.#createSocket();
    } else {
      this.#reconnectRequested = true;
      this.#socket.close();
    }
  }

  disconnect() {
    this.#reconnectRequested = false;
    this.#socket.close();
  }



  #createSocket() {
    const socket = new WebSocket(this.#url, this.#protocols);
    socket.onopen = event => this.#publishers.open.publish(event);
    socket.onclose = event => this.#publishers.close.publish(event);
    socket.onerror = error => this.#publishers.error.publish(error);
    socket.onmessage = event => this.#publishers.message.publish(event);
    return socket;
  }

}