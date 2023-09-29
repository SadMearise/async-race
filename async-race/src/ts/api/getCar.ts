import { GARAGE_URL } from './constants';
import { HTTPMethods } from '../constants';
import { TCar } from '../types';

const fetchCar = async (id: number): Promise<TCar> => {
  const response: Response = await fetch(
    `${GARAGE_URL}/${id}`,
    { method: HTTPMethods.get },
  );

  const car = await response.json();

  return car;
};

export default fetchCar;
