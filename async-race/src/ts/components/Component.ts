import { TComponentStructure } from '../types';

export default class Component {
  protected node: HTMLElement;

  constructor({
    tagName = 'div',
    classNames = [],
    textContent = '',
    attributes = {},
  }: TComponentStructure) {
    this.node = document.createElement(tagName);
    this.node.classList.add(...classNames);
    this.node.textContent = textContent;
    this.setAttributes(attributes);
  }

  public destroyChildren(): void {
    [...this.node.children].forEach((el) => el.remove());
  }

  public setAttributes(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([key, value]) => this.node.setAttribute(key, value));
  }

  public removeAttributes(attributes: string[]): void {
    attributes.forEach((attributeName) => this.node.removeAttribute(attributeName));
  }

  public setContent(value: string): void {
    this.node.textContent = value;
  }

  public append(...childs: Component[]): void {
    [...childs].forEach((child) => this.node.append(child.getNode()));
  }

  public addClass(className: string): void {
    this.node.classList.add(className);
  }

  public removeClass(className: string): void {
    this.node.classList.remove(className);
  }

  public addListener(
    event: string,
    callback: (e: Event | KeyboardEvent) => void,
    options: AddEventListenerOptions | boolean = false,
  ): void {
    this.node.addEventListener(event, callback, options);
  }

  public destroy(): void {
    this.node.remove();
  }

  public getNode(): HTMLElement {
    return this.node;
  }

  public toggleClass(className: string): void {
    this.node.classList.toggle(className);
  }

  public setHTML(html: string): void {
    this.node.innerHTML = html;
  }

  public toggleAttr(attributeName: string): void {
    this.node.toggleAttribute(attributeName);
  }
}
