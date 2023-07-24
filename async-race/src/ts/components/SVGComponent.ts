import { TSVGComponentStructure } from '../types';

export default class SVGComponent {
  protected node: SVGSVGElement;

  constructor({
    tagName = '',
    xmlns = '',
    classNames = [],
    attributes = {},
  }: TSVGComponentStructure) {
    this.node = document.createElementNS(xmlns, tagName) as SVGSVGElement;
    this.node.classList.add(...classNames);
    this.setAttributes(attributes);
  }

  public setAttributes(attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([key, value]) => this.node.setAttribute(key, value));
  }

  public append(...childs: SVGComponent[]): void {
    [...childs].forEach((child) => this.node.append(child.getNode()));
  }

  public getNode(): SVGSVGElement {
    return this.node;
  }
}
