import { WINNERS_URL } from './constants';
import { StatusCodes, HTTPMethods } from '../enums';

const getDeletedWinnerPromise = async (id: number): Promise<void> => {
  const response: Response = await fetch(
    `${WINNERS_URL}/${id}`,
    {
      method: HTTPMethods.delete,
    },
  );

  if (response.status === StatusCodes.code404) {
    throw new Error('Content not found');
  }

  return response.json();
};

export default getDeletedWinnerPromise;
