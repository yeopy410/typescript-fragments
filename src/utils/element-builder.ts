const SVGNS = "http://www.w3.org/2000/svg";



/**
 * Use {@link buildHTML} or {@link buildSVG} to create instances.
 */
export default class ElementBuilder<T extends HTMLElement | SVGElement> {
  #element;

  constructor(element: T) {
    this.#element = element;
  }

  addClassList(...tokens: string[]): ElementBuilder<T> {
    this.#element.classList.add(...tokens);
    return this;
  }

  setAttribute(qualifiedName: string, value: string): ElementBuilder<T> {
    this.#element.setAttribute(qualifiedName, value);
    return this;
  }

  setProperty(property: string, value: string | null, priority?: string | undefined): ElementBuilder<T> {
    this.#element.style.setProperty(property, value, priority);
    return this;
  }

  append(...nodes: (string | Node)[]): ElementBuilder<T> {
    this.#element.append(...nodes);
    return this;
  }

  build(): T {
    return this.#element;
  }

}



export function buildHTML<K extends keyof HTMLElementTagNameMap>(tagName: K) {
  return new ElementBuilder(document.createElement(tagName));
}

export function buildSVG<K extends keyof SVGElementTagNameMap>(qualifiedName: K) {
  return new ElementBuilder(document.createElementNS(SVGNS, qualifiedName));
}



export function template(...args: Element[]) {
  const template = document.createElement('template');
  template.content.append(...args);
  return template;
}

export function div(cssClass: string, ...args: Element[]) {
  const element = document.createElement('div');
  element.classList.add(cssClass);
  element.append(...args);
  return element;
}