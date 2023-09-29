import { HTTPMethods } from '../constants';
import { TCarBody, TCar } from '../types';
import { GARAGE_URL } from './constants';

const fetchUpdatedCar = async (id: number, body: TCarBody): Promise<TCar> => {
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

  const updatedCar = await response.json();

  return updatedCar;
};

export default fetchUpdatedCar;
