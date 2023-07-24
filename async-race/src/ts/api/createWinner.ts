import { WINNERS_URL } from './constants';
import { HTTPMethods, StatusCodes } from '../enums';
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

  if (response.status === StatusCodes.code500) {
    throw new Error('Insert failed, duplicate id');
  } else if (response.status === StatusCodes.code201) {
    return response.json();
  }

  throw new Error('error');
};

export default getCreatedWinnerPromise;
