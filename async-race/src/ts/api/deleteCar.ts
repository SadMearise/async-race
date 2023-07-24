import { GARAGE_URL } from './constants';
import { HTTPMethods } from '../enums';

const getDeletedCarPromise = async (id: number): Promise<void> => {
  const response: Response = await fetch(
    `${GARAGE_URL}/${id}`,
    {
      method: HTTPMethods.delete,
    },
  );

  return response.json();
};

export default getDeletedCarPromise;
