import state from '../../data/state';
import { Pages } from '../../constants';
import EventEmitter from '../../utils/EventEmitter';
import Component from '../Component';
import { NAVIGATION_ITEMS_CONTENT, PAGES_LIST } from './constants';

export default class Header extends Component {
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    super({
      tagName: 'header',
      classNames: ['header'],
    });

    this.eventEmitter = eventEmitter;

    this.render();
  }

  private render(): void {
    const containerComponent = new Component({ classNames: ['header__container', 'container'] });
    const bodyComponent = new Component({ classNames: ['header__body'] });
    const titleComponent = new Component({ tagName: 'h1', classNames: ['header__title'], textContent: 'ASYNC RACE' });
    const navigationMenuComponent = this.getRenderedNavigationMenuComponent();

    this.append(containerComponent);
    containerComponent.append(bodyComponent);
    bodyComponent.append(titleComponent, navigationMenuComponent);
  }

  private getRenderedNavigationMenuComponent(): Component {
    const navigationMenuComponent = new Component({ tagName: 'nav', classNames: ['header__nav', 'header-nav-menu'] });
    const navigationMenuListComponent = this.getRenderedNavigationMenuListComponent();

    navigationMenuComponent.append(navigationMenuListComponent);

    return navigationMenuComponent;
  }

  private getRenderedNavigationMenuListComponent(): Component {
    const navigationMenuListComponent = new Component({ tagName: 'ul', classNames: ['header-nav-menu__list'] });

    for (let i = 0; i < NAVIGATION_ITEMS_CONTENT.length; i += 1) {
      const navigationItemComponent = new Component({ tagName: 'li', classNames: ['header-nav-menu__item'] });
      const buttonComponent = new Component({
        tagName: 'button',
        classNames: ['header-nav-menu__btn', 'btn'],
        textContent: NAVIGATION_ITEMS_CONTENT[i],
        attributes: { type: 'button', 'data-page': PAGES_LIST[i] },
      });

      navigationItemComponent.append(buttonComponent);
      navigationMenuListComponent.append(navigationItemComponent);

      this.handleNavigationButtonListener(buttonComponent);
    }

    return navigationMenuListComponent;
  }

  private handleNavigationButtonListener(buttonComponent: Component): void {
    buttonComponent.addListener('click', async () => {
      const currentPage: string | undefined = buttonComponent.getNode().dataset.page;

      if (state.currentPage !== currentPage) {
        if (currentPage === Pages.garage) {
          state.currentPage = Pages.garage;
        } else if (currentPage === Pages.leaderboard) {
          state.currentPage = Pages.leaderboard;
        }

        this.eventEmitter.emit('leaderboard-pagination: set visibility');
        this.eventEmitter.emit('leaderboard: set visibility');
        this.eventEmitter.emit('control-menu: set visibility');
        this.eventEmitter.emit('garage-pagination: set visibility');
        this.eventEmitter.emit('garage: set visibility');
      }
    });
  }
}
