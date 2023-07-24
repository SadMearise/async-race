import { WINNERS_URL } from './constants';
import { HTTPMethods } from '../enums';
import { TWinner } from '../types';

const getCreatedWinnerPromise = async (body: TWinner): Promise<TWinner> => {
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

  return response.json();
};

export default getCreatedWinnerPromise;
