import { HTTPMethods } from '../constants';
import { TWinner, TWinnerBody } from '../types';
import { WINNERS_URL } from './constants';

const fetchUpdatedWinner = async (id: number, body: TWinnerBody): Promise<TWinner> => {
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

  const updatedWinner = await response.json();

  return updatedWinner;
};

export default fetchUpdatedWinner;
