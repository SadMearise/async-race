import { CAR_SVG } from '../../constants';
import { TSVG } from '../../types';

export const TABLE_COLUMNS: number = 5;
export const TH_HEADERS: string[] = ['Number', 'Car', 'Name', 'Wins', 'Best time (s)'];
export const TH_TAG: string = 'TH';
export const TH_CLASSNAMES: string[] = ['leaderboard-table__head-cell'];
export const TD_CLASSNAMES: string[] = ['leaderboard-table__row-cell'];
export const TD_TAG: string = 'TD';
export const LEADERBOARD_CAR_SVG: TSVG = {
  classNames: ['leaderboard-table__car-img', 'car-img', 'car-img_size_small'],
  ...CAR_SVG,
};
