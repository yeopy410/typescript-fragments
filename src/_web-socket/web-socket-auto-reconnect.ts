import Publisher from '../utils/publisher.js';



export default class WebSocketAutoReconnect {
  #reconnectRequest = new Publisher<CloseEvent>();
  public readonly reconnectRequest = this.#reconnectRequest.asSubscribable;



  constructor( // 여기에 추가로 재연결 간격이나 최대 재연결 시도 횟수 등도 받기.
    public option: number,
  ) {}



  handleClose(event: CloseEvent) {
    if (event.wasClean) return;
    // 깔끔하지 않았다면 재연결하는 코드. socket.close()는 wasClean하기 때문에 자동 재연결되지 않음.
    this.option
    {
      this.#reconnectRequest.publish(event);
    }
  }

}


new WebSocketAutoReconnect(1).reconnectRequest.subscribe(_ => {});