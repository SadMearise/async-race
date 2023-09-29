import { Pages } from '../constants';
import { TState } from '../types/index';

const state: TState = {
  currentPage: Pages.garage,
  currentGaragePage: 1,
  currentLeaderboardPage: 1,
  totalGaragePages: 1,
  totalLeaderboardPages: 1,
  winner: false,
  sortedTime: '',
  sortedWins: '',
};

export default state;
