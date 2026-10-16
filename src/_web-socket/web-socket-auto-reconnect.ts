import EventEmitter from '../utils/event-emitter.js';



export interface WebSocketAutoReconnectEvents {
  request: null;
}



/**
 * Use {@link WebSocketAutoReconnect.Builder} to create instances.
 */
export default class WebSocketAutoReconnect extends EventEmitter<WebSocketAutoReconnectEvents> {
  #option1;



  constructor( // 여기에 추가로 재연결 간격이나 최대 재연결 시도 횟수 등도 받기.
    option1: number,
  ) {
    super();
    this.#option1 = option1;
  }



  handleClose(event: CloseEvent) {
    if (event.wasClean) return;
    // 깔끔하지 않았다면 재연결하는 코드. socket.close()는 wasClean하기 때문에 자동 재연결되지 않음.
    this.#option1
    {
      this.emit('request', null);
    }
  }

  trigger() { // handleClose의 대체 검토. wasClean은 외부에서 검사하고, CloseEvent는 이 모듈에서 안 건들기?
    
  }

  reset() { // socket open event에서 호출하기. 혹은 외부 제3자에 의한 소켓 재연결시에도 호출 (다른 곳에서 재연결을 요청했는데 여기서 건들면 겹치니까).
    // reconnectRequest 예약 취소하고, 누적 재연결 횟수 초기화하기.
  }



  static readonly defaultOptions = {
    option1: 0,
  }

  static Builder = class {
    #options = { ...WebSocketAutoReconnect.defaultOptions };

    setOption1(value: number) {
      this.#options.option1 = value;
      return this;
    }

    build() {
      return new WebSocketAutoReconnect(
        this.#options.option1,
      );
    }
  }

}



// 사용 예시;
const webSocketAutoReconnect = new WebSocketAutoReconnect.Builder()
  .setOption1(1)
  .build();

// webSocketManager.events.close.subscribe(webSocketAutoReconnect.onClose);

webSocketAutoReconnect.on('request', () => {
  // webSocketManager.reconnect();
});
