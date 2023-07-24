import { WINNERS_URL } from './constants';
import { HTTPMethods } from '../enums';
import { TWinner } from '../types';

const getWinnerPromise = async (id: number): Promise<TWinner> => {
  const response: Response = await fetch(
    `${WINNERS_URL}/${id}`,
    { method: HTTPMethods.get },
  );

  return response.json();
};

export default getWinnerPromise;
