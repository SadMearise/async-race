import { GARAGE_URL } from './constants';
import { HTTPMethods } from '../enums';
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

  return response.json();
};

export default getCreatedCarPromise;
