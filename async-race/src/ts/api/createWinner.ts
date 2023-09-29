import { WINNERS_URL } from './constants';
import { HTTPMethods } from '../constants';
import { TWinner } from '../types';

const fetchCreatedWinner = async (body: TWinner): Promise<TWinner> => {
  const response: Response = await fetch(
    WINNERS_URL,
    {
      method: HTTPMethods.post,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const createdWinner = await response.json();

  return createdWinner;
};

export default fetchCreatedWinner;
