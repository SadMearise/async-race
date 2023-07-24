import { HTTPMethods } from '../enums';
import { TCarBody, TCar } from '../types';
import { GARAGE_URL } from './constants';

const getUpdatedCarPromise = async (id: number, body: TCarBody): Promise<TCar> => {
  const response: Response = await fetch(
    `${GARAGE_URL}/${id}`,
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

export default getUpdatedCarPromise;
