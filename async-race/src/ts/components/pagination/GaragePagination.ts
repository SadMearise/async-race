import Component from '../Component';
import EventEmitter from '../../utils/EventEmitter';
import state from '../../data/state';
import { GARAGE_LIMIT } from '../../constants';
import fetchCars from '../../api/getCars';
import { TCars } from '../../types';
import {
  PAGINATION_NEXT_BUTTON_CLASSES, PAGINATION_NEXT_BUTTON_TEXT,
  PAGINATION_PREV_BUTTON_CLASSES, PAGINATION_PREV_BUTTON_TEXT,
} from './constants';
import { Pages } from '../../constants';
import startedCars from '../../data/startedCars';

export default class GaragePagination extends Component {
  private eventEmitter: EventEmitter;

  private carsInfo: TCars;

  constructor(eventEmitter: EventEmitter, carsInfo: TCars) {
    super({
      classNames: ['pagination'],
    });

    this.eventEmitter = eventEmitter;
    this.carsInfo = carsInfo;

    this.render();

    this.setVisibility(this);

    this.eventEmitter.subscribe('garage-pagination: rerender', (dataJSON) => this.rerender(dataJSON));
    this.eventEmitter.subscribe('garage-pagination: set visibility', () => this.setVisibility(this));
  }

  private setVisibility(component: Component): void {
    const node: HTMLElement = component.getNode();

    node.style.display = state.currentPage === Pages.garage ? 'block' : 'none';
  }

  private rerender(dataJSON: string | undefined): void {
    if (dataJSON) {
      this.carsInfo = JSON.parse(dataJSON);

      this.destroyChildren();
      this.render();
    }
  }

  private render(): void {
    const prevButtonComponent = this.createButtonComponent(
      PAGINATION_PREV_BUTTON_TEXT,
      PAGINATION_PREV_BUTTON_CLASSES,
    );
    const nextButtonComponent = this.createButtonComponent(
      PAGINATION_NEXT_BUTTON_TEXT,
      PAGINATION_NEXT_BUTTON_CLASSES,
    );
    const pageCounterComponent = this.createPageCounterComponent();

    this.append(prevButtonComponent, pageCounterComponent, nextButtonComponent);

    this.handlePrevButtonListener(prevButtonComponent);
    this.handleNextButtonListener(nextButtonComponent);

    this.subscribersPrevButton(prevButtonComponent);
    this.subscribersNextButton(nextButtonComponent);
  }

  private handlePrevButtonListener(prevButtonComponent: Component): void {
    prevButtonComponent.addListener('click', async () => {
      if (state.currentGaragePage > 1) {
        state.currentGaragePage -= 1;
        startedCars.length = 0;

        const carsInfo: TCars = await fetchCars();

        this.eventEmitter.emit('garage: rerender', JSON.stringify(carsInfo));
        this.eventEmitter.emit('garage-pagination: rerender', JSON.stringify(carsInfo));
        this.eventEmitter.emit('race-button: remove disabled');
        this.eventEmitter.emit('create-button: remove disabled');
        this.eventEmitter.emit('generate-button: remove disabled');
        this.eventEmitter.emit('reset-button: add disabled');
      }
    });
  }

  private handleNextButtonListener(nextButtonComponent: Component): void {
    nextButtonComponent.addListener('click', async () => {
      if (state.totalGaragePages > state.currentGaragePage) {
        state.currentGaragePage += 1;
        startedCars.length = 0;

        const carsInfo: TCars = await fetchCars();

        this.eventEmitter.emit('garage: rerender', JSON.stringify(carsInfo));
        this.eventEmitter.emit('garage-pagination: rerender', JSON.stringify(carsInfo));
        this.eventEmitter.emit('race-button: remove disabled');
        this.eventEmitter.emit('create-button: remove disabled');
        this.eventEmitter.emit('generate-button: remove disabled');
        this.eventEmitter.emit('reset-button: add disabled');
      }
    });
  }

  private subscribersPrevButton(prevButtonComponent: Component): void {
    this.eventEmitter.subscribe('garage-pagination-prev: add disabled', () => {
      prevButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe('garage-pagination-prev: remove disabled', () => {
      prevButtonComponent.removeAttributes(['disabled']);
    });
  }

  private subscribersNextButton(nextButtonComponent: Component): void {
    this.eventEmitter.subscribe('garage-pagination-next: add disabled', () => {
      nextButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe('garage-pagination-next: remove disabled', () => {
      nextButtonComponent.removeAttributes(['disabled']);
    });
  }

  private createButtonComponent(textContent: string, classNames: string[]): Component {
    const buttonComponent = new Component({
      tagName: 'button',
      classNames,
      textContent,
      attributes: { type: 'button' },
    });

    return buttonComponent;
  }

  private createPageCounterComponent(): Component {
    const pageCounterComponent = new Component({
      tagName: 'span',
      classNames: ['pagination__page-counter'],
      textContent: this.getPageCounterTextContent(this.carsInfo),
    });

    return pageCounterComponent;
  }

  private setTotalCarPages(totalCars: number): void {
    let pages: number = Math.ceil(totalCars / GARAGE_LIMIT);

    if (!pages) {
      pages += 1;
    }

    state.totalGaragePages = pages;
  }

  private getPageCounterTextContent(allCars: TCars): string {
    this.setTotalCarPages(allCars.totalCars);

    return `${state.currentGaragePage} / ${state.totalGaragePages}`;
  }
}
