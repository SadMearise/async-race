import Popup from './components/Popup';
import Wrapper from './components/Wrapper';
import EventEmitter from './utils/EventEmitter';

export default class App {
  private body: HTMLElement;

  constructor() {
    this.body = document.body;
  }

  public start(): void {
    const eventEmitter: EventEmitter = new EventEmitter();

    const wrapperComponent: Wrapper = new Wrapper(eventEmitter);

    this.body.prepend(wrapperComponent.getNode());

    eventEmitter.subscribe('popup: open', (winnerResultJSON) => {
      if (winnerResultJSON) {
        const { carName, time }: { carName: string, time: string } = JSON.parse(winnerResultJSON);

        const popupComponent: Popup = new Popup(carName, time);

        this.body.append(popupComponent.getNode());
      }
    });
  }
}
