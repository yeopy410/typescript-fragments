import EventEmitter from './event-emitter.js';



export interface RetrySignalManagerEvents {
  retry: null;
}

const defaultOptions = { // 여기에 재시도 간격이나 최대 재시도 횟수 등을 넣기.
  option1: 0,
  option2: 0,
}



export default class RetrySignalManager extends EventEmitter<RetrySignalManagerEvents> {
  #options;
  #value = 0;
  #timeoutID: number | null = null;



  constructor(options: Partial<typeof defaultOptions> = {}) {
    super();
    this.#options = { ...defaultOptions, ...options };
  }



  /**
   * Request retry signal.
   *
   * If a timeout already exists, do not perform the operation and return false.
   * @returns Boolean indicating whether a operation was performed.
   */
  trigger(): boolean {
    if (this.#timeoutID != null) return false;

    this.#timeoutID = setTimeout(() => {
      this.#options;
      this.#value;
      this.#timeoutID = null;
      this.emit('retry', null);
    }, 0);

    return true;
  }

  reset(): void {
    this.cancel();
    this.#options;
    this.#value;
  }

  /**
   * Cancel timeout.
   *
   * Returns true if a timeout existed and was removed.
   * @returns Boolean indicating whether a operation was performed.
   */
  cancel(): boolean {
    if (this.#timeoutID == null) return false;

    clearTimeout(this.#timeoutID);
    this.#timeoutID = null;

    return true;
  }

}



// 사용 예시
const webSocketReconnectSignalManager = new RetrySignalManager({ option1: 1 });

// webSocketManager.on('close', event => {
//   if (event.wasClean) return; // socket.close()는 wasClean하기 때문에 자동 재연결되지 않음.
//   webSocketReconnectSignalManager.trigger();
// });

// webSocketManager.on('open', () => {
//   webSocketReconnectSignalManager.reset(); // 외부 제3자에 의한 소켓 재연결시에도 호출 (다른 곳에서 재연결을 요청했는데 여기서 건들면 겹치니까).
// });

webSocketReconnectSignalManager.on('retry', () => {
  // webSocketManager.reconnect();
});