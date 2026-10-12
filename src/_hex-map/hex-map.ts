import Publisher from '../utils/publisher.js';



export class HexMap {
  #canvas = document.createElement('canvas');
  #offscreenCanvas = this.#canvas.transferControlToOffscreen();
  public readonly screen: HTMLElement = this.#canvas;

  #publisher = new Publisher<any>();
  public readonly publisher = this.#publisher.asSubscribable;

  constructor() {}

}