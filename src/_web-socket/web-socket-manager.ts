import EventEmitter from '../utils/event-emitter.js';



export interface WebSocketManagerEvents {
  open: Event;
  close: CloseEvent;
  error: Event;
  message: MessageEvent;
}



export default class WebSocketManager extends EventEmitter<WebSocketManagerEvents> {
  #url: string;
  #protocols: string | string[] | undefined;
  #socket: WebSocket;
  #reconnectRequested = false;



  constructor(url: string, protocols?: string | string[]) {
    super();
    this.#url = url;
    this.#protocols = protocols;
    this.#socket = this.#createSocket();

    this.on('close', () => {
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
    socket.onopen = event => this.emit('open', event);
    socket.onclose = event => this.emit('close', event);
    socket.onerror = error => this.emit('error', error);
    socket.onmessage = event => this.emit('message', event);
    return socket;
  }

}