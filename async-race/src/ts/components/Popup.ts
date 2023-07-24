import Component from './Component';

export default class Popup extends Component {
  private carName: string;

  private time: string;

  constructor(carName: string, time: string) {
    super({
      classNames: ['popup'],
      attributes: { id: 'popup' },
    });

    this.carName = carName;
    this.time = time;

    this.render();
    this.open(this);
  }

  private render(): void {
    const bodyComponent = this.getRenderedBodyComponent();

    this.append(bodyComponent);
  }

  private getRenderedBodyComponent(): Component {
    const bodyComponent = new Component({ classNames: ['popup__body'] });

    const wrapperComponent = this.getRenderedWrapperComponent();

    bodyComponent.append(wrapperComponent);

    return bodyComponent;
  }

  private getRenderedWrapperComponent(): Component {
    const wrapperComponent = new Component({
      classNames: ['popup__wrapper'],
    });

    const contentComponent = this.getRenderedContentComponent();

    wrapperComponent.append(contentComponent);

    return wrapperComponent;
  }

  private getRenderedContentComponent(): Component {
    const contentComponent = new Component({ classNames: ['popup__content'] });

    const titleComponent = new Component({
      tagName: 'h3',
      classNames: ['popup__title'],
      textContent: `${this.carName} went first (${this.time}s)!`,
    });

    const acceptButtonComponent = new Component({
      tagName: 'button',
      classNames: ['popup__got-it-button', 'btn', 'btn_popup'],
      textContent: 'Ok',
    });

    this.handleAcceptButtonListener(acceptButtonComponent);

    contentComponent.append(titleComponent, acceptButtonComponent);

    return contentComponent;
  }

  private handleAcceptButtonListener(acceptButtonComponent: Component): void {
    acceptButtonComponent.addListener('click', () => this.close(this));
  }

  private open(currentPopup: Component): void {
    if (currentPopup) {
      document.body.classList.add('lock');
      currentPopup.addClass('open');
    }
  }

  private close(popupActive: Component): void {
    popupActive.removeClass('open');
    document.body.classList.remove('lock');
    this.destroy();
  }
}
