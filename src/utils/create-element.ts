const SVG_NAMESPACE = "http://www.w3.org/2000/svg";



export function createHTMLElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  setup?: (element: HTMLElementTagNameMap[K]) => void
) {
  const element = document.createElement(tagName);
  setup?.(element);
  return element;
}



export function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tagName: K,
  setup?: (element: SVGElementTagNameMap[K]) => void
) {
  const element = document.createElementNS(SVG_NAMESPACE, tagName);
  setup?.(element);
  return element;
}



export function template(...nodes: (string | Node)[]) {
  const template = document.createElement('template');
  template.content.append(...nodes);
  return template;
}

export function div(cssClass: string, ...nodes: (string | Node)[]) {
  const element = document.createElement('div');
  element.classList.add(cssClass);
  element.append(...nodes);
  return element;
}