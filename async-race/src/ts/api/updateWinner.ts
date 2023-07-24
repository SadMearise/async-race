import { HTTPMethods } from '../enums';
import { TWinner, TWinnerBody } from '../types';
import { WINNERS_URL } from './constants';

const getUpdatedWinnerPromise = async (id: number, body: TWinnerBody): Promise<TWinner> => {
  const response: Response = await fetch(
    `${WINNERS_URL}/${id}`,
    {
      method: HTTPMethods.put,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.json();
};

export default getUpdatedWinnerPromise;
