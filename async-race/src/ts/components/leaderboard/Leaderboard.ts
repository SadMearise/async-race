import Component from '../Component';
import EventEmitter from '../../utils/EventEmitter';
import { Order, Pages } from '../../enums';
import state from '../../data/state';
import { TCar, TWinner, TWinners } from '../../types';
import SVGComponent from '../SVGComponent';
import {
  CAR_SVG, TABLE_COLUMNS, TD_CLASSNAMES, TD_TAG, TH_CLASSNAMES, TH_HEADERS, TH_TAG,
} from './constants';
import getDeletedWinnerPromise from '../../api/deleteWinner';
import getWinnersPromise from '../../api/getWinners';
import getCarPromise from '../../api/getCar';
import getCreatedWinnerPromise from '../../api/createWinner';
import getWinnerPromise from '../../api/getWinner';
import getUpdatedWinnerPromise from '../../api/updateWinner';

export default class Leaderboard extends Component {
  private eventEmitter: EventEmitter;

  private winnersInfo: TWinners;

  private winnersCarsInfo: TCar[];

  constructor(
    eventEmitter: EventEmitter,
    winnersInfo: TWinners,
    winnersCarsInfo: TCar[],
  ) {
    super({
      tagName: 'section',
      classNames: ['leaderboard-section'],
    });

    this.eventEmitter = eventEmitter;

    this.winnersInfo = winnersInfo;

    this.winnersCarsInfo = winnersCarsInfo;

    this.render();

    this.eventEmitter.subscribe('leaderboard: rerender', async (dataJSON) => this.rerender(dataJSON));

    this.setVisibility(this);

    this.eventEmitter.subscribe('leaderboard: set visibility', () => this.setVisibility(this));
    this.eventEmitter.subscribe('leaderboard: add winner', async (dataJSON) => {
      if (dataJSON) {
        this.addWinner(dataJSON);
      }
    });
  }

  private async addWinner(dataJSON: string): Promise<void> {
    const { id }: { id: number } = JSON.parse(dataJSON);
    let { time }: { time: number } = JSON.parse(dataJSON);
    let wins: number;

    try {
      const winnerInfo: TWinner = await getWinnerPromise(id);
      if (!Object.keys(winnerInfo).length) {
        throw new Error();
      }

      wins = winnerInfo.wins + 1;

      if (winnerInfo.time < time) {
        time = winnerInfo.time;
      }
      const updatedWinner: TWinner = await getUpdatedWinnerPromise(id, { wins, time });
      if (!Object.keys(updatedWinner).length) {
        throw new Error();
      }
    } catch {
      wins = 1;
      await getCreatedWinnerPromise({ id, wins, time });
    }

    const winnersInfo: TWinners = await getWinnersPromise();

    this.eventEmitter.emit('leaderboard: rerender', JSON.stringify(winnersInfo));
    this.eventEmitter.emit('leaderboard-pagination: rerender', JSON.stringify(winnersInfo));
  }

  private setVisibility(component: Component): void {
    const node: HTMLElement = component.getNode();

    node.style.display = state.currentPage === Pages.leaderboard ? 'block' : 'none';
  }

  private render(): void {
    const titleComponent = this.getRenderedTitleComponent();
    const sectionComponent = this.getRenderedTable();

    this.append(titleComponent, sectionComponent);
  }

  private async rerender(dataJSON: string | undefined): Promise<void> {
    if (dataJSON) {
      this.winnersInfo = JSON.parse(dataJSON);
      this.winnersCarsInfo = await this.getWinnersCarsInfo(this.winnersInfo);

      this.destroyChildren();
      this.render();
    }
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

  private getRenderedTitleComponent(): Component {
    const titleComponent = new Component({
      tagName: 'h2',
      classNames: ['leaderboard-section__title', 'section-title'],
      textContent: 'Winners ',
    });

    titleComponent.append(this.createPostfixComponent());

    return titleComponent;
  }

  private createPostfixComponent(): Component {
    const postfixComponent = new Component({
      tagName: 'span',
      classNames: ['section-title__postfix'],
      textContent: `[${this.winnersInfo.totalWinners}]`,
    });

    return postfixComponent;
  }

  private getRenderedTable(): Component {
    const tableComponent = new Component({
      tagName: 'table',
      classNames: ['leaderboard-section__table', 'leaderboard-table'],
    });

    const tableBodyComponent = this.getRenderedTableBody();

    tableComponent.append(tableBodyComponent);

    return tableComponent;
  }

  private getRenderedTableBody(): Component {
    const tableBodyComponent = new Component({
      tagName: 'tbody',
      classNames: ['leaderboard-table__body'],
    });

    const tableHeadComponent = this.getRenderedTableHead();

    tableBodyComponent.append(tableHeadComponent);

    const { winners }: { winners: TWinner[] } = this.winnersInfo;

    for (let i = 0; i < this.winnersCarsInfo.length; i += 1) {
      const carNumber: number = i + 1;
      const tableRowComponent = this.getRenderedTableRow(
        this.winnersCarsInfo[i].id,
        carNumber,
        this.winnersCarsInfo[i].color,
        this.winnersCarsInfo[i].name,
        winners[i].wins,
        winners[i].time,
      );

      tableBodyComponent.append(tableRowComponent);
    }

    return tableBodyComponent;
  }

  private getRenderedTableHead(): Component {
    const tableHeadComponent = new Component({
      tagName: 'tr',
      classNames: ['leaderboard-table__head'],
    });
    const rowAttrs: Record<string, string>[] = [{}, {}, {}, { id: 'wins' }, { id: 'time' }];

    for (let i = 0; i < TABLE_COLUMNS; i += 1) {
      const tableCell = this.getRenderedTableCell(TH_TAG, TH_CLASSNAMES, TH_HEADERS[i], '', rowAttrs[i]);

      if (Object.keys(rowAttrs[i]).length) {
        this.handleTableCell(tableCell, rowAttrs[i].id);
      }
      tableHeadComponent.append(tableCell);
    }

    return tableHeadComponent;
  }

  private handleTableCell(tableCell: Component, idName: string): void {
    tableCell.addListener('click', async () => {
      let sortMode: string = '';

      if (idName === 'wins') {
        if (state.sortedWins === Order.asc) {
          sortMode = Order.desc;
        } else if (state.sortedWins === Order.desc || !state.sortedWins) {
          sortMode = Order.asc;
        }
        state.sortedWins = sortMode;
      } else if (idName === 'time') {
        if (state.sortedTime === Order.asc) {
          sortMode = Order.desc;
        } else if (state.sortedTime === Order.desc || !state.sortedTime) {
          sortMode = Order.asc;
        }
        state.sortedTime = sortMode;
      }

      const winnersInfo: TWinners = await getWinnersPromise(idName, sortMode);
      this.eventEmitter.emit('leaderboard: rerender', JSON.stringify(winnersInfo));
    });
  }

  private getRenderedTableRow(
    carID: number,
    number: number,
    color: string,
    carName: string,
    wins: number,
    time: number,
  ): Component {
    const rowContent: (string | number)[] = [number, '', carName, wins, time];
    const rowColor: string[] = ['', color, '', '', ''];

    const tableRowComponent = new Component({
      tagName: 'tr',
      classNames: ['leaderboard-table__row'],
      attributes: { 'data-id': `${carID}` },
    });

    for (let i = 0; i < TABLE_COLUMNS; i += 1) {
      const tableCell = this.getRenderedTableCell(
        TD_TAG,
        TD_CLASSNAMES,
        rowContent[i],
        rowColor[i],
      );

      tableRowComponent.append(tableCell);
    }

    this.eventEmitter.unsubscribe(`remove-button${carID}: remove car from leaderboard`);
    this.eventEmitter.subscribe(`remove-button${carID}: remove car from leaderboard`, () => {
      this.removeCar(tableRowComponent);
    });

    return tableRowComponent;
  }

  private async removeCar(tableRowComponent: Component): Promise<void> {
    const rowID: number = Number(tableRowComponent.getNode().dataset.id);

    await getDeletedWinnerPromise(rowID);
    let winnersInfo: TWinners = await getWinnersPromise();

    if (!winnersInfo.winners.length && state.currentLeaderboardPage > 1) {
      state.currentLeaderboardPage -= 1;
      winnersInfo = await getWinnersPromise();
    }

    this.eventEmitter.emit('leaderboard: rerender', JSON.stringify(winnersInfo));
    this.eventEmitter.emit('leaderboard-pagination: rerender', JSON.stringify(winnersInfo));
  }

  private getRenderedTableCell(
    tagName: string,
    classNames: string[],
    textContent: string | number,
    color?: string,
    attributes?: Record<string, string>,
  ): Component {
    const cellComponent = new Component({
      tagName,
      classNames,
      textContent: String(textContent),
      attributes,
    });

    if (color) {
      const imageComponent = this.getRenderedSVGComponent(color);
      cellComponent.getNode().append(imageComponent.getNode());
    }

    return cellComponent;
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
}
