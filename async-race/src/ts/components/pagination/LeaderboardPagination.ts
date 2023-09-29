import Component from '../Component';
import EventEmitter from '../../utils/EventEmitter';
import state from '../../data/state';
import { WINNERS_LIMIT } from '../../constants';
import { TWinners } from '../../types';
import {
  PAGINATION_NEXT_BUTTON_CLASSES, PAGINATION_NEXT_BUTTON_TEXT,
  PAGINATION_PREV_BUTTON_CLASSES, PAGINATION_PREV_BUTTON_TEXT,
} from './constants';
import fetchWinners from '../../api/getWinners';
import { Pages } from '../../constants';

export default class LeaderboardPagination extends Component {
  private eventEmitter: EventEmitter;

  private winnersInfo: TWinners;

  constructor(eventEmitter: EventEmitter, winnersInfo: TWinners) {
    super({
      classNames: ['pagination'],
    });

    this.eventEmitter = eventEmitter;
    this.winnersInfo = winnersInfo;

    this.render();

    this.setVisibility(this);

    this.eventEmitter.subscribe('leaderboard-pagination: rerender', (dataJSON) => this.rerender(dataJSON));

    this.eventEmitter.subscribe('leaderboard-pagination: set visibility', () => this.setVisibility(this));
  }

  private setVisibility(component: Component): void {
    const node: HTMLElement = component.getNode();

    node.style.display = state.currentPage === Pages.leaderboard ? 'block' : 'none';
  }

  private rerender(dataJSON: string | undefined): void {
    if (dataJSON) {
      this.winnersInfo = JSON.parse(dataJSON);

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

    this.handlePrevButtonListener(prevButtonComponent);
    this.handleNextButtonListener(nextButtonComponent);

    this.append(prevButtonComponent, pageCounterComponent, nextButtonComponent);
  }

  private handlePrevButtonListener(prevButtonComponent: Component): void {
    prevButtonComponent.addListener('click', async () => {
      if (state.currentLeaderboardPage > 1) {
        state.currentLeaderboardPage -= 1;

        const winnersInfo: TWinners = await fetchWinners();

        this.eventEmitter.emit('leaderboard: rerender', JSON.stringify(winnersInfo));
        this.eventEmitter.emit('leaderboard-pagination: rerender', JSON.stringify(winnersInfo));
      }
    });
  }

  private handleNextButtonListener(nextButtonComponent: Component): void {
    nextButtonComponent.addListener('click', async () => {
      if (state.totalLeaderboardPages > state.currentLeaderboardPage) {
        state.currentLeaderboardPage += 1;

        const winnersInfo: TWinners = await fetchWinners();

        this.eventEmitter.emit('leaderboard: rerender', JSON.stringify(winnersInfo));
        this.eventEmitter.emit('leaderboard-pagination: rerender', JSON.stringify(winnersInfo));
      }
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
      textContent: this.getPageCounterTextContent(this.winnersInfo),
    });

    return pageCounterComponent;
  }

  private setTotalWinnerPages(totalWinners: number): void {
    let pages: number = Math.ceil(totalWinners / WINNERS_LIMIT);

    if (!pages) {
      pages += 1;
    }

    state.totalLeaderboardPages = pages;
  }

  private getPageCounterTextContent(allWinners: TWinners): string {
    this.setTotalWinnerPages(allWinners.totalWinners);

    return `${state.currentLeaderboardPage} / ${state.totalLeaderboardPages}`;
  }
}
