const SVG_NAMESPACE = "http://www.w3.org/2000/svg";



/**
 * Use {@link HTMLElementBuilder} or {@link SVGElementBuilder} to build specifically.
 */
export default class ElementBuilder<T extends Element> {
  protected _element: T;

  constructor(element: T) {
    this._element = element;
  }

  addClassList(...tokens: string[]) {
    this._element.classList.add(...tokens);
    return this;
  }

  setAttribute(qualifiedName: string, value: string) {
    this._element.setAttribute(qualifiedName, value);
    return this;
  }

  setTextContent(text: string | null) {
    this._element.textContent = text;
    return this;
  }

  append(...nodes: (string | Node)[]) {
    this._element.append(...nodes);
    return this;
  }

  build() {
    return this._element;
  }

}



export class HTMLElementBuilder<K extends keyof HTMLElementTagNameMap> extends ElementBuilder<HTMLElementTagNameMap[K]> {
  constructor(tagName: K) {
    super(document.createElement(tagName));
  }

  setProperty(property: string, value: string | null, priority?: string | undefined) {
    this._element.style.setProperty(property, value, priority);
    return this;
  }

}



export class SVGElementBuilder<K extends keyof SVGElementTagNameMap> extends ElementBuilder<SVGElementTagNameMap[K]> {
  constructor(qualifiedName: K) {
    super(document.createElementNS(SVG_NAMESPACE, qualifiedName));
  }

  setProperty(property: string, value: string | null, priority?: string | undefined) {
    this._element.style.setProperty(property, value, priority);
    return this;
  }

}