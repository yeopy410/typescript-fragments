import Publisher from '../utils/publisher.js';
import type { Subscribable } from '../utils/publisher.js';



export type WebSocketEvents = {
  readonly open: Subscribable<Event>;
  readonly close: Subscribable<CloseEvent>;
  readonly error: Subscribable<Event>;
  readonly message: Subscribable<MessageEvent>;
}



/**
 * Use {@link createWebSocketManager} to create instances.
 */
export default class WebSocketManager {
  #createSocket: () => WebSocket;
  #socket: WebSocket;
  #reconnectRequested = false;



  constructor(
    public readonly events: WebSocketEvents,
    createWebSocket: () => WebSocket
  ) {
    this.#createSocket = createWebSocket;
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

}



export function createWebSocketManager(
  url: string,
  protocols?: string | string[]
) {
  const publishers = {
    open: new Publisher<Event>(),
    close: new Publisher<CloseEvent>(),
    error: new Publisher<Event>(),
    message: new Publisher<MessageEvent>(),
  }

  const createWebSocket = () => {
    const socket = new WebSocket(url, protocols);
    socket.onopen = event => publishers.open.publish(event);
    socket.onclose = event => publishers.close.publish(event);
    socket.onerror = error => publishers.error.publish(error);
    socket.onmessage = event => publishers.message.publish(event);
    return socket;
  }

  return new WebSocketManager(publishers, createWebSocket);
}