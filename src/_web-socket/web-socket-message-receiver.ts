import Publisher from '../utils/publisher.js';
import type { Subscribable } from '../utils/publisher.js';



type WebSocketMessages = {
  readonly a: Subscribable<any>;
}



// 대충 메시지를 받아서, 어떤 메시지인지 식별하고, 올바른 형식의 데이터인지 검증해고, 특정 형식의 데이터로 전파.
export default class WebSocketMessageReceiver {
  #publishers = {
    a: new Publisher<any>(),
  }
  public readonly messages: WebSocketMessages = this.#publishers;



  constructor() {}



  onMessage(event: MessageEvent) {
    event.data
  }

}