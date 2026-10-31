import EventEmitter from './event-emitter.js';

type Parsers<ResultMap> = {
  [K in keyof ResultMap]: (data: unknown) => ResultMap[K];
};



// 언젠가 이름을 적절하도록 바꾸는게 이 코드의 핵심 과제.
export default class EmitterWithDataParsing<ResultMap extends object> extends EventEmitter<ResultMap> {
  #parserMap;

  /**
   * @param parserMap Be careful not to overlap with existing property names in the JavaScript object.
   * @param parserMap If there is a parsing problem, just throw an error.
   */
  constructor(parserMap: Parsers<ResultMap>) {
    super();
    this.#parserMap = parserMap;
  }



  /**
   * If there is a parsing problem, throw an error.
   */
  emitWithParsing<K extends keyof ResultMap>(type: K, data: unknown) {
    this.emit(type, this.#parserMap[type](data));
  }

}



// 사용 예시
const eventEmitter = new EventEmitter<{message: MessageEvent}>();

const parserMap = {
  a: (data: unknown) => {data; return 1;},
  b: (data: unknown) => {data; return 2;},
}
const messageDataParsingEmitter = new EmitterWithDataParsing(parserMap);



eventEmitter.on('message', event => {
  const data = event.data as unknown;
  if (
    (
      typeof data === 'object' &&
      data !== null
    ) && (
      'type' in data &&
      'value' in data
    ) && (
      typeof data.type === 'string' &&
      data.type in parserMap
    )
  ) {
    const type = data.type as keyof typeof parserMap;
  
    try {
      messageDataParsingEmitter.emitWithParsing(type, data.value);
    } catch (error) {
      console.error(error);
    }
  }
});