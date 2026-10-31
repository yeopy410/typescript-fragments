import EventEmitter from '../utils/event-emitter.js';

type Result<T, E = string> = {
  readonly ok: true;
  readonly value: T;
} | {
  readonly ok: false;
  readonly reason: E;
};



// 대충 메시지를 받아서, 어떤 메시지인지 식별하고, 올바른 형식의 데이터인지 검증해고, 특정 형식의 데이터로 전파.
export default class DataParsingEmitter<EventMap extends object> extends EventEmitter<EventMap> {
  #parserByType = new Map<unknown, (data: unknown) => Result<unknown>>();



  constructor() {
    super();
  }



  setParser<K extends keyof EventMap>(type: K, parser: (data: unknown) => Result<EventMap[K]>) {
    this.#parserByType.set(type, parser);
  }

  deleteParser<K extends keyof EventMap>(type: K) {
    this.#parserByType.delete(type);
  }

  emitWithParsing(data: unknown) {
    if (!(
      typeof data === 'object' &&
      data !== null &&
      'type' in data &&
      'value' in data &&
      typeof data.type === 'string'
    )) throw new Error('Message event data problem.');

    const result = this.#parserByType.get(data.type)?.(data.value);
    if (result == null) throw new Error(`No parser: ${data.type}`);

    if (result.ok) {
      const type = data.type as keyof EventMap;
      this.emit(type, result.value as EventMap[typeof type]);
    } else {
      throw new Error(result.reason);
    }
  }

}



// 사용 예시
// const messageReceiver = new DataParsingEmitter();

// webSocketManager.on('message', event => {
//   messageReceiver.receive(event);
// });