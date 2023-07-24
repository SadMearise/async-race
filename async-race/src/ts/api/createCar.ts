import { GARAGE_URL } from './constants';
import { HTTPMethods, StatusCodes } from '../enums';
import { TCarBody, TCar } from '../types';

const getCreatedCarPromise = async (body: TCarBody): Promise<TCar> => {
  const response: Response = await fetch(
    GARAGE_URL,
    {
      method: HTTPMethods.post,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (response.status === StatusCodes.code201) {
    return response.json();
  }

  throw new Error('error');
};

export default getCreatedCarPromise;
