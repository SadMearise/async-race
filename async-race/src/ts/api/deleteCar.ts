import { GARAGE_URL } from './constants';
import { HTTPMethods } from '../constants';

const fetchDeletedCar = async (id: number): Promise<void> => {
  const response: Response = await fetch(
    `${GARAGE_URL}/${id}`,
    {
      method: HTTPMethods.delete,
    },
  );

  const deletedCar = await response.json();

  return deletedCar;
};

export default fetchDeletedCar;
