import { GARAGE_URL } from './constants';
import { HTTPMethods } from '../constants';
import { TCarBody, TCar } from '../types';

const fetchCreatedCar = async (body: TCarBody): Promise<TCar> => {
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

  const createdCar = await response.json();

  return createdCar;
};

export default fetchCreatedCar;
