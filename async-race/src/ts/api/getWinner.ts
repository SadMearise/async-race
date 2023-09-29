import { WINNERS_URL } from './constants';
import { HTTPMethods } from '../constants';
import { TWinner } from '../types';

const fetchWinner = async (id: number): Promise<TWinner> => {
  const response: Response = await fetch(
    `${WINNERS_URL}/${id}`,
    { method: HTTPMethods.get },
  );

  const winner = await response.json();

  return winner;
};

export default fetchWinner;
