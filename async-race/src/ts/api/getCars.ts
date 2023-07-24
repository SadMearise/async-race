import { GARAGE_URL } from './constants';
import { GARAGE_LIMIT } from '../constants';
import { HTTPMethods } from '../enums';
import state from '../data/state';
import { TCars } from '../types';

const getCarsPromise = async (): Promise<TCars> => {
  const response: Response = await fetch(
    `${GARAGE_URL}?_page=${state.currentGaragePage}&_limit=${GARAGE_LIMIT}`,
    {
      method: HTTPMethods.get,
    },
  );
  const totalCars: string | null = response.headers.get('X-Total-Count');

  if (!totalCars) {
    throw new Error('error');
  }

  return {
    cars: await response.json(),
    totalCars: Number(totalCars),
  };
};

export default getCarsPromise;
