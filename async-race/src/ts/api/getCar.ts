import { GARAGE_URL } from './constants';
import { HTTPMethods } from '../enums';
import { TCar } from '../types';

const getCarPromise = async (id: number): Promise<TCar> => {
  const response: Response = await fetch(
    `${GARAGE_URL}/${id}`,
    { method: HTTPMethods.get },
  );

  return response.json();
};

export default getCarPromise;
