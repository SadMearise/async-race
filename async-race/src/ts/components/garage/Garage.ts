import { log } from 'console';
import Component from '../Component';
import SVGComponent from '../SVGComponent';
import EventEmitter from '../../utils/EventEmitter';
import { CAR_SVG, MILLISECONDS_PER_SECOND } from './constants';
import getDeletedCarPromise from '../../api/deleteCar';
import getCarsPromise from '../../api/getCars';
import getEngineOptions from '../../api/controlCarEngine';
import { EngineStatus, Pages } from '../../enums';
import {
  IEngineStartResult, TCar, TCars, TEngineOptions,
} from '../../types';
import getEngineStartResult from '../../api/getEngineStartResult';
import state from '../../data/state';
import startedCars from '../../data/startedCars';

export default class Garage extends Component {
  private eventEmitter: EventEmitter;

  private carsInfo: TCars;

  constructor(eventEmitter: EventEmitter, carsInfo: TCars) {
    super({
      tagName: 'section',
      classNames: ['garage-section'],
    });

    this.eventEmitter = eventEmitter;
    this.carsInfo = carsInfo;

    this.render();

    this.eventEmitter.subscribe('garage: rerender', async (dataJSON) => this.rerender(dataJSON));

    this.setVisibility(this);

    this.eventEmitter.subscribe('garage: set visibility', () => this.setVisibility(this));
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
    const titleComponent = this.getRenderedTitleComponent();
    const tracksComponent = this.getRenderedTracksComponent();

    this.append(titleComponent, tracksComponent);
  }

  private getRenderedTitleComponent(): Component {
    const titleComponent = new Component({
      tagName: 'h2',
      classNames: ['garage-section__title', 'section-title'],
      textContent: 'Garage ',
    });

    titleComponent.append(this.createPostfixComponent());

    return titleComponent;
  }

  private createPostfixComponent(): Component {
    const postfixComponent = new Component({
      tagName: 'span',
      classNames: ['section-title__postfix'],
      textContent: `[${this.carsInfo.totalCars}]`,
    });

    return postfixComponent;
  }

  private getRenderedTracksComponent(): Component {
    const tracksComponent = new Component({ classNames: ['garage-section__tracks'] });

    for (let i = 0; i < this.carsInfo.cars.length; i += 1) {
      const trackComponent = this.getRenderedTrackComponent(this.carsInfo.cars[i]);

      tracksComponent.append(trackComponent);
    }

    return tracksComponent;
  }

  private getRenderedTrackComponent(car: TCar): Component {
    const trackComponent = new Component({
      classNames: ['garage-section__track', 'track'],
      attributes: { 'data-id': `${car.id}` },
    });
    const trackTopComponent = this.getRenderedTrackTopComponent(car);
    const trackBottomComponent = this.getRenderedTrackBottomComponent(car, trackComponent);

    trackComponent.append(trackTopComponent, trackBottomComponent);

    this.unsubscriptionsTrack(car.id);
    this.subscriptionsTrack(trackComponent, car.id);

    return trackComponent;
  }

  private unsubscriptionsTrack(id: number): void {
    this.eventEmitter.unsubscribe(`remove-button${id}: remove car`);
    this.eventEmitter.unsubscribe(`select-button${id}: select car`);
  }

  private subscriptionsTrack(trackComponent: Component, id: number): void {
    this.eventEmitter.subscribe(`remove-button${id}: remove car`, () => {
      this.removeCar(trackComponent);
    });
    this.eventEmitter.subscribe(`select-button${id}: select car`, (dataJSON) => {
      this.selectCar(dataJSON, id);
    });
  }

  private async removeCar(trackComponent: Component): Promise<void> {
    const trackID: number = Number(trackComponent.getNode().dataset.id);

    await getDeletedCarPromise(trackID);
    let carsInfo: TCars = await getCarsPromise();

    if (!carsInfo.cars.length) {
      this.eventEmitter.emit('race-button: add disabled');
      if (state.currentGaragePage !== 1) {
        state.currentGaragePage -= 1;
      }
    }
    carsInfo = await getCarsPromise();

    this.eventEmitter.emit('garage: rerender', JSON.stringify(carsInfo));
    this.eventEmitter.emit('garage-pagination: rerender', JSON.stringify(carsInfo));
  }

  private selectCar(dataJSON: string | undefined, carID: number): void {
    if (dataJSON) {
      this.eventEmitter.emit('update-field: update values', dataJSON);
      this.eventEmitter.emit('update-form-field: unlock');
      this.eventEmitter.emit('update-button: set data', String(carID));
    }
  }

  private getRenderedTrackTopComponent(car: TCar): Component {
    const trackTopComponent = new Component({ classNames: ['track__top'] });
    const carSettingsComponent = new Component({ classNames: ['track__car-settings'] });
    const selectButtonComponent = this.getRenderedSelectButton(car);
    const removeButtonComponent = this.getRenderedRemoveButton(car);
    const carNameComponent = new Component({
      tagName: 'span',
      classNames: ['track__car-name'],
      textContent: `${car.name}`,
    });

    carSettingsComponent.append(selectButtonComponent, removeButtonComponent);
    trackTopComponent.append(carSettingsComponent, carNameComponent);

    return trackTopComponent;
  }

  private getRenderedSelectButton(car: TCar): Component {
    const selectButtonComponent = this.createButtonComponent('SELECT', ['track__select-car-btn', 'btn']);

    this.handleSelectButtonListener(selectButtonComponent, car);

    this.unsubscriptionsSelectButton(car.id);
    this.subscriptionsSelectButton(selectButtonComponent, car.id);

    return selectButtonComponent;
  }

  private handleSelectButtonListener(selectButtonComponent: Component, car: TCar): void {
    selectButtonComponent.addListener('click', () => {
      const carJSON: string = JSON.stringify(car);

      this.eventEmitter.emit(`select-button${car.id}: select car`, carJSON);
    });
  }

  private unsubscriptionsSelectButton(id: number): void {
    this.eventEmitter.unsubscribe(`select-button${id}: add disabled`);
    this.eventEmitter.unsubscribe(`select-button${id}: remove disabled`);
  }

  private subscriptionsSelectButton(selectButtonComponent: Component, id: number): void {
    this.eventEmitter.subscribe(`select-button${id}: add disabled`, () => {
      selectButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe(`select-button${id}: remove disabled`, () => {
      selectButtonComponent.removeAttributes(['disabled']);
    });
  }

  private getRenderedRemoveButton(car: TCar): Component {
    const removeButtonComponent = this.createButtonComponent('REMOVE', ['track__select-car-btn', 'btn']);

    this.handleRemoveButtonListener(removeButtonComponent, car.id);

    this.unsubscriptionsRemoveButton(car.id);
    this.subscriptionsRemoveButton(removeButtonComponent, car.id);

    return removeButtonComponent;
  }

  private handleRemoveButtonListener(removeButtonComponent: Component, id: number): void {
    removeButtonComponent.addListener('click', () => {
      this.eventEmitter.emit(`remove-button${id}: remove car`);
      this.eventEmitter.emit(`remove-button${id}: remove car from leaderboard`);
    });
  }

  private unsubscriptionsRemoveButton(id: number): void {
    this.eventEmitter.unsubscribe(`remove-button${id}: add disabled`);
    this.eventEmitter.unsubscribe(`remove-button${id}: remove disabled`);
  }

  private subscriptionsRemoveButton(removeButtonComponent: Component, id: number): void {
    this.eventEmitter.subscribe(`remove-button${id}: add disabled`, () => {
      removeButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe(`remove-button${id}: remove disabled`, () => {
      removeButtonComponent.removeAttributes(['disabled']);
    });
  }

  private getRenderedTrackBottomComponent(car: TCar, trackComponent: Component): Component {
    const trackBottomComponent = new Component({ classNames: ['track__bottom'] });
    const engineControlComponent = this.getRenderedEngineControlComponent(car);
    const layoutComponent = this.getRenderedLayoutComponent(car, trackComponent);

    trackBottomComponent.append(engineControlComponent, layoutComponent);

    return trackBottomComponent;
  }

  private getRenderedEngineControlComponent(car: TCar): Component {
    const engineControlComponent = new Component({ classNames: ['track__engine-control'] });

    const startEngineButtonComponent = this.getRenderedStartEngineButton(car);
    const stopEngineButtonComponent = this.getRenderedStopEngineButton(car);

    engineControlComponent.append(startEngineButtonComponent, stopEngineButtonComponent);

    this.unsubscriptionsEngineControl(car.id);
    this.subscriptionsEngineControl(
      startEngineButtonComponent,
      stopEngineButtonComponent,
      car.id,
    );

    return engineControlComponent;
  }

  private unsubscriptionsEngineControl(id: number): void {
    this.eventEmitter.unsubscribe(`start-engine-button${id}: add disabled`);
    this.eventEmitter.unsubscribe(`start-engine-button${id}: remove disabled`);
    this.eventEmitter.unsubscribe(`stop-engine-button${id}: add disabled`);
    this.eventEmitter.unsubscribe(`stop-engine-button${id}: remove disabled`);
  }

  private subscriptionsEngineControl(
    startEngineButtonComponent: Component,
    stopEngineButtonComponent: Component,
    id: number,
  ): void {
    this.eventEmitter.subscribe(`start-engine-button${id}: add disabled`, () => {
      startEngineButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe(`start-engine-button${id}: remove disabled`, () => {
      startEngineButtonComponent.removeAttributes(['disabled']);
    });
    this.eventEmitter.subscribe(`stop-engine-button${id}: add disabled`, () => {
      stopEngineButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe(`stop-engine-button${id}: remove disabled`, () => {
      stopEngineButtonComponent.removeAttributes(['disabled']);
    });
  }

  private getRenderedStartEngineButton(car: TCar): Component {
    const startEngineButtonClasses = ['track__engine-control-btn-start', 'btn', 'btn_engine', 'btn_engine_start'];
    const startEngineButtonContent = 'A';

    const startEngineButtonComponent = this.createButtonComponent(
      startEngineButtonContent,
      startEngineButtonClasses,
    );

    this.handleStartEngineButtonListener(startEngineButtonComponent, car.id);

    this.unsubscriptionsStartEngineButton(car.id);
    this.subscriptionsStartEngineButton(car.id);

    return startEngineButtonComponent;
  }

  private unsubscriptionsStartEngineButton(id: number): void {
    this.eventEmitter.unsubscribe(`start-engine-button${id}: start`);
  }

  private subscriptionsStartEngineButton(id: number): void {
    this.eventEmitter.subscribe(`start-engine-button${id}: start`, async () => {
      this.eventEmitter.emit(`start-engine-button${id}: add disabled`);

      const engineOptions: TEngineOptions = await getEngineOptions(id, EngineStatus.started);

      this.eventEmitter.emit(`start-engine-button${id}: start animation`, JSON.stringify(engineOptions));
      startedCars.push(id);

      const engineStartResult: Promise<IEngineStartResult> = getEngineStartResult(id);
      this.eventEmitter.emit(`stop-engine-button${id}: remove disabled`);

      engineStartResult.then((result: IEngineStartResult) => {
        if (!result.success) {
          this.eventEmitter.emit(`car-animation${id}: cancel`, EngineStatus.started);
        }
      });
    });
  }

  private getRenderedStopEngineButton(car: TCar): Component {
    const stopEngineButtonClasses = ['track__engine-control-btn-stop', 'btn', 'btn_engine', 'btn_engine_stop'];
    const stopEngineButtonContent = 'B';
    const stopEngineButtonAttributes = { disabled: '' };

    const stopEngineButtonComponent = this.createButtonComponent(
      stopEngineButtonContent,
      stopEngineButtonClasses,
      stopEngineButtonAttributes,
    );

    this.handleStopEngineButtonListener(stopEngineButtonComponent, car.id);

    this.unsubscriptionsStopEngineButton(car.id);
    this.subscriptionsStopEngineButton(car.id);

    return stopEngineButtonComponent;
  }

  private unsubscriptionsStopEngineButton(id: number): void {
    this.eventEmitter.unsubscribe(`stop-engine-button${id}: stop`);
  }

  private subscriptionsStopEngineButton(id: number): void {
    this.eventEmitter.subscribe(`stop-engine-button${id}: stop`, async () => {
      this.eventEmitter.emit(`stop-engine-button${id}: add disabled`);

      await getEngineOptions(id, EngineStatus.stopped);

      const filteredStartedCars: number[] = startedCars.filter((carID) => carID !== id);
      startedCars.length = 0;
      startedCars.push(...filteredStartedCars);

      this.eventEmitter.emit(`car-animation${id}: cancel`, EngineStatus.stopped);
      this.eventEmitter.emit(`start-engine-button${id}: remove disabled`);
      this.eventEmitter.emit(`remove-button${id}: remove disabled`);
      this.eventEmitter.emit(`select-button${id}: remove disabled`);

      if (!startedCars.length) {
        this.eventEmitter.emit('race-button: remove disabled');
        this.eventEmitter.emit('create-button: remove disabled');
        this.eventEmitter.emit('generate-button: remove disabled');
        this.eventEmitter.emit('reset-button: add disabled');
      }
    });
  }

  private getRenderedLayoutComponent(
    car: TCar,
    trackComponent: Component,
  ): Component {
    const layoutComponent = new Component({ classNames: ['track__layout'] });
    const svgComponent = this.getRenderedSVGComponent(car.color);
    const finishImgComponent = new Component({
      tagName: 'img',
      classNames: ['track__finish-img'],
      attributes: { src: './img/finish.png', alt: 'finish' },
    });

    layoutComponent.getNode().append(svgComponent.getNode());
    layoutComponent.append(finishImgComponent);

    this.unsubscriptionsLayout(car.id);
    this.subscriptionsLayout(car, svgComponent, trackComponent);

    return layoutComponent;
  }

  private unsubscriptionsLayout(id: number): void {
    this.eventEmitter.unsubscribe(`race-button${id}: start animation`);
    this.eventEmitter.unsubscribe(`start-engine-button${id}: start animation`);
  }

  private subscriptionsLayout(
    car: TCar,
    svgComponent: SVGComponent,
    trackComponent: Component,
  ): void {
    this.eventEmitter.subscribe(`race-button${car.id}: start animation`, async (optionsJSON) => {
      if (optionsJSON) {
        const {
          velocity, distance,
        }: {
          velocity: number,
          distance: number
        } = JSON.parse(optionsJSON);

        this.startCarAnimation(car, svgComponent, trackComponent, { velocity, distance }, true);
      }
    });

    this.eventEmitter.subscribe(`start-engine-button${car.id}: start animation`, (optionsJSON) => {
      if (optionsJSON) {
        const {
          velocity, distance,
        }: {
          velocity: number,
          distance: number
        } = JSON.parse(optionsJSON);

        this.startCarAnimation(car, svgComponent, trackComponent, { velocity, distance }, false);
      }
    });
  }

  private getRenderedSVGComponent(color: string): SVGComponent {
    const svgComponent = new SVGComponent({
      tagName: 'svg',
      xmlns: CAR_SVG.xmlns,
      classNames: CAR_SVG.classNames,
      attributes: CAR_SVG.attributes,
    });

    const pathComponent = new SVGComponent({
      tagName: 'path',
      xmlns: CAR_SVG.xmlns,
      attributes: { ...CAR_SVG.path.attributes, fill: `${color}` },
    });

    svgComponent.append(pathComponent);

    return svgComponent;
  }

  private handleStartEngineButtonListener(
    startEngineButtonComponent: Component,
    id: number,
  ): void {
    startEngineButtonComponent.addListener('click', () => {
      this.eventEmitter.emit('race-button: add disabled');
      this.eventEmitter.emit('generate-button: add disabled');
      this.eventEmitter.emit('update-form-field: lock');
      this.eventEmitter.emit(`remove-button${id}: add disabled`);
      this.eventEmitter.emit(`select-button${id}: add disabled`);
      this.eventEmitter.emit(`start-engine-button${id}: start`);
    });
  }

  private handleStopEngineButtonListener(
    stopEngineButtonComponent: Component,
    id: number,
  ): void {
    stopEngineButtonComponent.addListener('click', () => {
      this.eventEmitter.emit(`stop-engine-button${id}: stop`);
    });
  }

  private createButtonComponent(
    textContent: string,
    classNames: string[],
    attrs?: Record<string, string> | undefined,
  ): Component {
    const buttonComponent = new Component({
      tagName: 'button',
      classNames,
      textContent,
      attributes: { ...attrs, type: 'button' },
    });

    return buttonComponent;
  }

  private startCarAnimation(
    car: TCar,
    carSVG: SVGComponent,
    trackComponent: Component,
    { distance, velocity }: TEngineOptions,
    popupActive: boolean,
  ): void {
    const animationDuration: number = distance / velocity;
    const svgNode: SVGSVGElement = carSVG.getNode();
    const carWidth: number = svgNode.getBoundingClientRect().width;
    const trackWidth: number = trackComponent.getNode().getBoundingClientRect().width;
    const path: number = trackWidth - carWidth;
    let startAnimation: null | number = null;
    let requestAnimationID: number;

    const step = (timestamp: number): void => {
      if (!startAnimation) {
        startAnimation = timestamp;
      }

      const elapsed: number = timestamp - startAnimation;
      const translate: number = Math.min((path / animationDuration) * elapsed, path);
      svgNode.style.transform = `translateX(${translate}px)`;
      const progress: number = (timestamp - startAnimation) / animationDuration;
      if (this.isWinner(translate, path)) {
        if (popupActive) this.showRaceResults(car, animationDuration);
        this.eventEmitter.emit('reset-button: remove disabled');
      }
      if (progress < 1) {
        requestAnimationID = requestAnimationFrame(step);
      }
    };

    requestAnimationID = requestAnimationFrame(step);
    this.eventEmitter.unsubscribe(`car-animation${car.id}: cancel`);
    this.eventEmitter.subscribe(`car-animation${car.id}: cancel`, (engineStatus) => {
      if (engineStatus === EngineStatus.stopped) svgNode.style.transform = 'translateX(0px)';
      cancelAnimationFrame(requestAnimationID);
    });
  }

  private isWinner(translate: number, path: number): boolean {
    if (translate === path && !state.winner) {
      return true;
    }

    return false;
  }

  private getWinnerDataJSON(car: TCar, animationDuration: number): string {
    const dataJSON: string = JSON.stringify({
      carName: car.name,
      time: this.getWinnerTime(animationDuration),
    });

    return dataJSON;
  }

  private getWinnerTime(animationDuration: number): number {
    return Number((animationDuration / MILLISECONDS_PER_SECOND).toFixed(2));
  }

  private showRaceResults(car: TCar, animationDuration: number): void {
    state.winner = true;
    this.openPopup(state.winner, car, animationDuration);
    const data: Record<string, number> = {
      id: car.id, time: this.getWinnerTime(animationDuration),
    };
    this.eventEmitter.emit('leaderboard: add winner', JSON.stringify(data));
  }

  private openPopup(
    winner: boolean,
    car: TCar,
    animationDuration: number,
  ): void {
    if (winner) {
      const winnerDataJSON: string = this.getWinnerDataJSON(car, animationDuration);

      this.eventEmitter.emit('popup: open', winnerDataJSON);
    }
  }
}
