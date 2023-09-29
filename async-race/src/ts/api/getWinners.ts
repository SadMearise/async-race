import { WINNERS_URL } from './constants';
import { WINNERS_LIMIT, HTTPMethods } from '../constants';
import state from '../data/state';
import { TWinners } from '../types';

const fetchWinners = async (sort?: string, order?: string): Promise<TWinners> => {
  let url = `${WINNERS_URL}?_page=${state.currentLeaderboardPage}&_limit=${WINNERS_LIMIT}`;

  if (sort) {
    url += `&_sort=${sort}`;
  }

  if (order) {
    url += `&_order=${order}`;
  }

  const response: Response = await fetch(
    url,
    {
      method: HTTPMethods.get,
    },
  );
  const totalWinners: string | null = response.headers.get('X-Total-Count');

  return {
    winners: await response.json(),
    totalWinners: Number(totalWinners),
  };
};

export default fetchWinners;
