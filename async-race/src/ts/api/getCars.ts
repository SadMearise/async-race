import { GARAGE_URL } from './constants';
import { GARAGE_LIMIT, HTTPMethods } from '../constants';
import state from '../data/state';
import { TCars } from '../types';

const fetchCars = async (): Promise<TCars> => {
  const response: Response = await fetch(
    `${GARAGE_URL}?_page=${state.currentGaragePage}&_limit=${GARAGE_LIMIT}`,
    {
      method: HTTPMethods.get,
    },
  );
  const totalCars: string | null = response.headers.get('X-Total-Count');

  return {
    cars: await response.json(),
    totalCars: Number(totalCars),
  };
};

export default fetchCars;
