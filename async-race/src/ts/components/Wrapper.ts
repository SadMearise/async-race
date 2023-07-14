import Component from './Component';
import EventEmitter from '../utils/EventEmitter';
import Header from './header/Header';
import Main from './Main';
import Footer from './footer/Footer';

export default class Wrapper extends Component {
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    super({
      classNames: ['wrapper'],
    });

    this.eventEmitter = eventEmitter;

    this.render();
  }

  private render(): void {
    const headerComponent: Header = new Header(this.eventEmitter);
    const mainComponent: Main = new Main(this.eventEmitter);
    const footerComponent: Footer = new Footer();

    this.append(headerComponent, mainComponent, footerComponent);
  }
}
