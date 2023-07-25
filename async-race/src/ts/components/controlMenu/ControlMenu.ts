import Component from '../Component';
import EventEmitter from '../../utils/EventEmitter';
import getCreatedCarPromise from '../../api/createCar';
import getCarsPromise from '../../api/getCars';
import getUpdatedCarPromise from '../../api/updateCar';
import {
  IEngineStartResult, TCar,
  TCars, TEngineOptions, TWinners,
} from '../../types';
import getEngineOptions from '../../api/controlCarEngine';
import { EngineStatus, Pages } from '../../enums';
import state from '../../data/state';
import getEngineStartResult from '../../api/getEngineStartResult';
import {
  CAR_BRANDS, CAR_MODELS, COLOR_CLASSES, COLOR_TYPE_VALUE, CREATE_BUTTON_TEXT, GENERATE_BUTTON_TEXT,
  HEX_LENGTH,
  NUMBER_RANDOM_GENERATED_CARS, RACE_BUTTON_TEXT, RESET_BUTTON_TEXT,
  TEXT_CLASSES, TEXT_TYPE_VALUE, UPDATE_BUTTON_ATTRS, UPDATE_BUTTON_TEXT,
  UPDATE_INPUT1_ATTRS, UPDATE_INPUT2_ATTRS,
} from './constants';
import getUpdatedWinnerPromise from '../../api/updateWinner';
import getWinnerPromise from '../../api/getWinner';
import getWinnersPromise from '../../api/getWinners';
import startedCars from '../../data/startedCars';

export default class ControlMenu extends Component {
  private eventEmitter: EventEmitter;

  private carsInfo: TCars;

  constructor(eventEmitter: EventEmitter, carsInfo: TCars) {
    super({
      tagName: 'form',
      classNames: ['control-menu'],
    });

    this.eventEmitter = eventEmitter;

    this.carsInfo = carsInfo;

    this.render();

    this.setVisibility(this);

    this.subscriptionsControlMenu();
  }

  private subscriptionsControlMenu(): void {
    this.eventEmitter.subscribe('control-menu: reset', () => {
      const node: HTMLFormElement = <HTMLFormElement> this.getNode();
      node.reset();
    });
    this.eventEmitter.subscribe('control-menu: set visibility', () => this.setVisibility(this));
  }

  private setVisibility(component: Component): void {
    const node: HTMLElement = component.getNode();

    node.style.display = state.currentPage === Pages.garage ? 'block' : 'none';
  }

  private render(): void {
    this.append(
      this.getRenderedFormFieldCreateComponent(),
      this.getRenderedFormFieldUpdateComponent(),
      this.getRenderedFormFieldButtonsComponent(),
    );
  }

  private getRenderedFormFieldCreateComponent(): Component {
    const formFieldComponent = new Component({ classNames: ['control-menu__form-field'] });
    const textInputComponent = this.getRenderedCreateTextInput();
    const colorInputComponent = this.getRenderedCreateColorInput();
    const createButtonComponent = this.getRenderedCreateButton(
      textInputComponent,
      colorInputComponent,
    );

    formFieldComponent.append(
      textInputComponent,
      colorInputComponent,
      createButtonComponent,
    );

    return formFieldComponent;
  }

  private getRenderedCreateTextInput(): Component {
    const textInputComponent = this.createInputComponent(TEXT_TYPE_VALUE, TEXT_CLASSES);

    return textInputComponent;
  }

  private getRenderedCreateColorInput(): Component {
    const colorInputComponent = this.createInputComponent(COLOR_TYPE_VALUE, COLOR_CLASSES);

    return colorInputComponent;
  }

  private getRenderedCreateButton(
    textInputComponent: Component,
    colorInputComponent: Component,
  ): Component {
    const createButtonComponent = this.createButtonComponent(CREATE_BUTTON_TEXT);

    this.handleCreateButtonListener(
      createButtonComponent,
      textInputComponent,
      colorInputComponent,
    );

    this.subscriptionsCreateButton(createButtonComponent);

    return createButtonComponent;
  }

  private handleCreateButtonListener(
    createButtonComponent: Component,
    textInputComponent: Component,
    colorInputComponent: Component,
  ): void {
    createButtonComponent.addListener('click', async () => {
      this.eventEmitter.emit('create-button: add disabled');
      const textValue: string = (textInputComponent.getNode() as HTMLInputElement).value;
      const colorValue: string = (colorInputComponent.getNode() as HTMLInputElement).value;

      await getCreatedCarPromise({ name: textValue, color: colorValue });
      const carsInfo: TCars = await getCarsPromise();
      if (carsInfo.cars.length) {
        this.eventEmitter.emit('race-button: remove disabled');
      }

      this.eventEmitter.emit('garage: rerender', JSON.stringify(carsInfo));
      this.eventEmitter.emit('garage-pagination: rerender', JSON.stringify(carsInfo));
      this.eventEmitter.emit('create-button: remove disabled');
    });
  }

  private subscriptionsCreateButton(createButtonComponent: Component): void {
    this.eventEmitter.subscribe('create-button: add disabled', () => {
      createButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe('create-button: remove disabled', () => {
      createButtonComponent.removeAttributes(['disabled']);
    });
  }

  private getRenderedFormFieldUpdateComponent(): Component {
    const formFieldComponent = new Component({ classNames: ['control-menu__form-field'] });
    const textInputComponent = this.getRenderedUpdateTextInput();
    const colorInputComponent = this.getRenderedUpdateColorInput();
    const updateButtonComponent = this.getRenderedUpdateButton(
      textInputComponent,
      colorInputComponent,
    );

    formFieldComponent.append(textInputComponent, colorInputComponent, updateButtonComponent);

    this.subscriptionsFormFieldUpdate(
      textInputComponent,
      colorInputComponent,
      updateButtonComponent,
    );

    return formFieldComponent;
  }

  private subscriptionsFormFieldUpdate(
    textInputComponent: Component,
    colorInputComponent: Component,
    updateButtonComponent: Component,
  ): void {
    this.eventEmitter.subscribe('update-field: update values', (dataJSON: string | undefined) => {
      if (dataJSON) {
        const data: TCar = JSON.parse(dataJSON);
        const textNode: HTMLElement = textInputComponent.getNode();
        const colorNode: HTMLElement = colorInputComponent.getNode();

        (textNode as HTMLInputElement).value = data.name;
        (colorNode as HTMLInputElement).value = data.color;
      }
    });
    this.eventEmitter.subscribe('update-form-field: lock', () => {
      updateButtonComponent.setAttributes({ disabled: '' });
      textInputComponent.setAttributes({ disabled: '' });
      colorInputComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe('update-form-field: unlock', () => {
      textInputComponent.removeAttributes(['disabled']);
      colorInputComponent.removeAttributes(['disabled']);
      updateButtonComponent.removeAttributes(['disabled']);
    });
  }

  private getRenderedUpdateTextInput(): Component {
    const textInputComponent = this.createInputComponent(
      TEXT_TYPE_VALUE,
      TEXT_CLASSES,
      UPDATE_INPUT1_ATTRS,
    );

    return textInputComponent;
  }

  private getRenderedUpdateColorInput(): Component {
    const colorInputComponent = this.createInputComponent(
      COLOR_TYPE_VALUE,
      COLOR_CLASSES,
      UPDATE_INPUT2_ATTRS,
    );

    return colorInputComponent;
  }

  private getRenderedUpdateButton(
    textInputComponent: Component,
    colorInputComponent: Component,
  ): Component {
    const updateButtonComponent = this.createButtonComponent(
      UPDATE_BUTTON_TEXT,
      UPDATE_BUTTON_ATTRS,
    );

    this.handleUpdateButtonListener(updateButtonComponent, textInputComponent, colorInputComponent);

    this.subscriptionsUpdateButton(updateButtonComponent);

    return updateButtonComponent;
  }

  private handleUpdateButtonListener(
    updateButtonComponent: Component,
    textInputComponent: Component,
    colorInputComponent: Component,
  ): void {
    updateButtonComponent.addListener('click', async () => {
      const textValue: string = (textInputComponent.getNode() as HTMLInputElement).value;
      const colorValue: string = (colorInputComponent.getNode() as HTMLInputElement).value;

      const carID: number = Number(updateButtonComponent.getNode().dataset.id);
      this.eventEmitter.emit('update-form-field: lock');

      await getUpdatedCarPromise(carID, { name: textValue, color: colorValue });

      const carsInfo: TCars = await getCarsPromise();
      this.eventEmitter.emit('control-menu: reset');
      this.eventEmitter.emit('garage: rerender', JSON.stringify(carsInfo));

      const { wins, time }: { wins: number, time: number } = await getWinnerPromise(carID);
      await getUpdatedWinnerPromise(carID, { wins, time });

      const winnersInfo: TWinners = await getWinnersPromise();
      this.eventEmitter.emit('leaderboard: rerender', JSON.stringify(winnersInfo));
    });
  }

  private subscriptionsUpdateButton(updateButtonComponent: Component): void {
    this.eventEmitter.subscribe('update-button: set data', (carID: string | undefined) => {
      if (carID) {
        updateButtonComponent.setAttributes({ 'data-id': carID });
      }
    });
  }

  private getRenderedFormFieldButtonsComponent(): Component {
    const formFieldComponent = new Component({ classNames: ['control-menu__form-field'] });
    const raceButtonComponent = this.getRenderedRaceButton();
    const resetButtonComponent = this.getRenderedResetButton();
    const generateCarsButtonComponent = this.getRenderedGenerateButton();

    formFieldComponent.append(
      raceButtonComponent,
      resetButtonComponent,
      generateCarsButtonComponent,
    );

    return formFieldComponent;
  }

  private getRenderedRaceButton(): Component {
    let raceButtonAttrs: Record<string, string> = {};

    if (!this.carsInfo.cars.length) {
      raceButtonAttrs = { disabled: '' };
    }

    const raceButtonComponent = this.createButtonComponent(RACE_BUTTON_TEXT, raceButtonAttrs);

    this.handleRaceButtonListener(raceButtonComponent);

    this.subscriptionsRaceButton(raceButtonComponent);

    return raceButtonComponent;
  }

  private handleRaceButtonListener(raceButtonComponent: Component): void {
    raceButtonComponent.addListener('click', async () => {
      state.winner = false;
      this.eventEmitter.emit('race-button: add disabled');
      this.eventEmitter.emit('create-button: add disabled');
      this.eventEmitter.emit('generate-button: add disabled');
      this.eventEmitter.emit('garage-pagination-prev: add disabled');
      this.eventEmitter.emit('garage-pagination-next: add disabled');
      this.eventEmitter.emit('update-form-field: lock');

      const carsInfo: TCars = await getCarsPromise();

      const engineOptionsPromises: Promise<TEngineOptions>[] = [];

      for (let i = 0; i < carsInfo.cars.length; i += 1) {
        this.eventEmitter.emit(`start-engine-button${carsInfo.cars[i].id}: add disabled`);
        this.eventEmitter.emit(`remove-button${carsInfo.cars[i].id}: add disabled`);
        this.eventEmitter.emit(`select-button${carsInfo.cars[i].id}: add disabled`);
        engineOptionsPromises.push(getEngineOptions(carsInfo.cars[i].id, EngineStatus.started));
      }

      const engineOptionsResults: TEngineOptions[] = await Promise.all(engineOptionsPromises);

      for (let i = 0; i < engineOptionsResults.length; i += 1) {
        const { id }: { id: number } = carsInfo.cars[i];

        this.eventEmitter.emit(`race-button${id}: start animation`, JSON.stringify(engineOptionsResults[i]));
        startedCars.push(id);

        const engineStartResult: Promise<IEngineStartResult> = getEngineStartResult(id);
        this.eventEmitter.emit(`stop-engine-button${id}: remove disabled`);

        engineStartResult.then((result: IEngineStartResult): void => {
          if (!result.success) {
            this.eventEmitter.emit(`car-animation${id}: cancel`, EngineStatus.started);
          }
        });
      }
    });
  }

  private subscriptionsRaceButton(raceButtonComponent: Component): void {
    this.eventEmitter.subscribe('race-button: add disabled', () => {
      raceButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe('race-button: remove disabled', () => {
      raceButtonComponent.removeAttributes(['disabled']);
    });
  }

  private getRenderedResetButton(): Component {
    const resetButtonComponent = this.createButtonComponent(RESET_BUTTON_TEXT, { disabled: '' });

    this.handleResetButtonListener(resetButtonComponent);

    this.subscriptionsResetButton(resetButtonComponent);

    return resetButtonComponent;
  }

  private handleResetButtonListener(resetButtonComponent: Component): void {
    resetButtonComponent.addListener('click', async () => {
      this.eventEmitter.emit('reset-button: add disabled');
      const carsInfo: TCars = await getCarsPromise();

      const engineOptionsPromises: Promise<TEngineOptions>[] = [];
      for (let i = 0; i < carsInfo.cars.length; i += 1) {
        const { id }: { id: number } = carsInfo.cars[i];

        this.eventEmitter.emit(`stop-engine-button${id}: add disabled`);
        engineOptionsPromises.push(getEngineOptions(id, EngineStatus.stopped));
      }

      const engineOptionsResults: TEngineOptions[] = await Promise.all(engineOptionsPromises);

      for (let i = 0; i < engineOptionsResults.length; i += 1) {
        const { id }: { id: number } = carsInfo.cars[i];

        this.eventEmitter.emit(`car-animation${id}: cancel`, EngineStatus.stopped);
        this.eventEmitter.emit(`start-engine-button${id}: remove disabled`);
        this.eventEmitter.emit(`remove-button${id}: remove disabled`);
        this.eventEmitter.emit(`select-button${id}: remove disabled`);
      }

      this.eventEmitter.emit('create-button: remove disabled');
      this.eventEmitter.emit('generate-button: remove disabled');
      this.eventEmitter.emit('race-button: remove disabled');
      this.eventEmitter.emit('garage-pagination-prev: remove disabled');
      this.eventEmitter.emit('garage-pagination-next: remove disabled');
    });
  }

  private subscriptionsResetButton(resetButtonComponent: Component): void {
    this.eventEmitter.subscribe('reset-button: add disabled', () => {
      resetButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe('reset-button: remove disabled', () => {
      resetButtonComponent.removeAttributes(['disabled']);
    });
  }

  private getRenderedGenerateButton(): Component {
    const generateCarsButtonComponent = this.createButtonComponent(GENERATE_BUTTON_TEXT);

    this.handleGenerateCarsButtonListener(generateCarsButtonComponent);

    this.subscriptionsGenerateButton(generateCarsButtonComponent);

    return generateCarsButtonComponent;
  }

  private handleGenerateCarsButtonListener(generateCarsButtonComponent: Component): void {
    generateCarsButtonComponent.addListener('click', async () => {
      generateCarsButtonComponent.setAttributes({ disabled: '' });
      this.eventEmitter.emit('race-button: add disabled');
      await this.generateCars();

      const carsInfo: TCars = await getCarsPromise();
      if (carsInfo.cars.length) {
        this.eventEmitter.emit('race-button: remove disabled');
      }

      this.eventEmitter.emit('garage: rerender', JSON.stringify(carsInfo));
      this.eventEmitter.emit('garage-pagination: rerender', JSON.stringify(carsInfo));

      generateCarsButtonComponent.removeAttributes(['disabled']);
      this.eventEmitter.emit('race-button: remove disabled');
    });
  }

  private subscriptionsGenerateButton(generateCarsButtonComponent: Component): void {
    this.eventEmitter.subscribe('generate-button: add disabled', () => {
      generateCarsButtonComponent.setAttributes({ disabled: '' });
    });
    this.eventEmitter.subscribe('generate-button: remove disabled', () => {
      generateCarsButtonComponent.removeAttributes(['disabled']);
    });
  }

  private createInputComponent(
    type: string,
    classNames: string[],
    attrs?: Record<string, string> | undefined,
  ): Component {
    const inputComponent = new Component({
      tagName: 'input',
      classNames,
      attributes: { ...attrs, type },
    });

    return inputComponent;
  }

  private createButtonComponent(
    textContent: string,
    attrs?: Record<string, string> | undefined,
  ): Component {
    const buttonComponent = new Component({
      tagName: 'button',
      classNames: ['control-menu__race-btn', 'btn'],
      textContent,
      attributes: { ...attrs, type: 'button' },
    });

    return buttonComponent;
  }

  private async generateCars(): Promise<TCar[]> {
    const promises: Promise<TCar>[] = [];

    for (let i = 0; i < NUMBER_RANDOM_GENERATED_CARS; i += 1) {
      const randomCarName: string = this.generateRandomCarName();
      const randomColor: string = this.generateRandomColor();

      promises.push(getCreatedCarPromise({ name: randomCarName, color: randomColor }));
    }

    const result: TCar[] = await Promise.all(promises);

    return result;
  }

  private generateRandomCarName(): string {
    const brandsLength: number = CAR_BRANDS.length - 1;
    const modelsLength: number = CAR_MODELS.length - 1;
    const randomBrand: number = Math.ceil(Math.random() * brandsLength);
    const randomModel: number = Math.ceil(Math.random() * modelsLength);
    const randomCar: string = `${CAR_BRANDS[randomBrand]} ${CAR_MODELS[randomModel]}`;

    return randomCar;
  }

  private generateRandomColor(): string {
    const r: number = Math.floor(Math.random() * (256));
    const g: number = Math.floor(Math.random() * (256));
    const b: number = Math.floor(Math.random() * (256));

    let color: string = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

    if (color.length !== HEX_LENGTH) {
      color = this.generateRandomColor();
    }

    return color;
  }
}
