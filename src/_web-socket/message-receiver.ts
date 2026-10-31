import EventEmitter from '../utils/event-emitter.js';



export interface MessageReceiverEvents {
  readonly a: string;
}



// 대충 메시지를 받아서, 어떤 메시지인지 식별하고, 올바른 형식의 데이터인지 검증해고, 특정 형식의 데이터로 전파.
export default class MessageReceiver extends EventEmitter<MessageReceiverEvents> {



  constructor() {
    super();
  }



  receive(data: unknown) {
    data
  }

}



// 사용 예시
//const messageReceiver = new MessageReceiver();

// webSocketManager.on('message', event => {
//   messageReceiver.receive(event.data);
// });