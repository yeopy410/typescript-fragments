import EventEmitter from '../utils/event-emitter.js';



interface HexMapEvents {

}



export class HexMap extends EventEmitter<HexMapEvents> {
  #canvas = document.createElement('canvas');
  #offscreenCanvas = this.#canvas.transferControlToOffscreen();
  public readonly screen: HTMLElement = this.#canvas;



  constructor() {
    super();
  }

}