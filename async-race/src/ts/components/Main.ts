import Component from './Component';
import EventEmitter from '../utils/EventEmitter';
import ControlMenu from './controlMenu/ControlMenu';
import Garage from './garage/Garage';
import getCarsPromise from '../api/getCars';
import {
  TCar, TCars, TWinner, TWinners,
} from '../types';
import getWinnersPromise from '../api/getWinners';
import LeaderboardPagination from './pagination/LeaderboardPagination';
import GaragePagination from './pagination/GaragePagination';
import Leaderboard from './leaderboard/Leaderboard';
import getCarPromise from '../api/getCar';

export default class Main extends Component {
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    super({
      tagName: 'main',
      classNames: ['main', 'container'],
    });

    this.eventEmitter = eventEmitter;

    this.render();

    this.eventEmitter.subscribe('main: render', () => this.render());
  }

  private async render(): Promise<void> {
    const carsInfo: TCars = await getCarsPromise();
    const winnersInfo: TWinners = await getWinnersPromise();
    const winnersCarsInfo: TCar[] = await this.getWinnersCarsInfo(winnersInfo);

    const controlMenuComponent: ControlMenu = new ControlMenu(this.eventEmitter, carsInfo);
    const garageComponent: Garage = new Garage(this.eventEmitter, carsInfo);
    const leaderboardComponent: Leaderboard = new Leaderboard(
      this.eventEmitter,
      winnersInfo,
      winnersCarsInfo,
    );
    const garagePaginationComponent: GaragePagination = new GaragePagination(
      this.eventEmitter,
      carsInfo,
    );
    const leaderboardPaginationComponent: LeaderboardPagination = new LeaderboardPagination(
      this.eventEmitter,
      winnersInfo,
    );

    this.append(
      controlMenuComponent,
      garageComponent,
      garagePaginationComponent,
      leaderboardComponent,
      leaderboardPaginationComponent,
    );
  }

  private async getWinnersCarsInfo(winnersInfo: TWinners): Promise<TCar[]> {
    const { winners }: { winners: TWinner[] } = winnersInfo;

    const carsInfoPromises: Promise<TCar>[] = [];
    for (let i = 0; i < winners.length; i += 1) {
      carsInfoPromises.push(getCarPromise(winners[i].id));
    }

    const carsInfoResults: TCar[] = await Promise.all(carsInfoPromises);

    return carsInfoResults;
  }
}
