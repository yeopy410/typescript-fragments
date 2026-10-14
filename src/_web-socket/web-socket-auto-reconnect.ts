import Publisher from '../utils/publisher.js';
import type { Subscribable } from '../utils/publisher.js';



/**
 * Use {@link WebSocketAutoReconnect.Builder} to create instances.
 */
export default class WebSocketAutoReconnect {
  #option1;

  #reconnectRequest = new Publisher<CloseEvent>();
  public readonly reconnectRequest: Subscribable<CloseEvent> = this.#reconnectRequest;



  constructor( // 여기에 추가로 재연결 간격이나 최대 재연결 시도 횟수 등도 받기.
    option1: number,
  ) {
    this.#option1 = option1;
  }



  onClose(event: CloseEvent) {
    if (event.wasClean) return;
    // 깔끔하지 않았다면 재연결하는 코드. socket.close()는 wasClean하기 때문에 자동 재연결되지 않음.
    this.#option1
    {
      this.#reconnectRequest.publish(event);
    }
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

webSocketAutoReconnect.reconnectRequest.subscribe(() => {
  // webSocketManager.reconnect();
});
