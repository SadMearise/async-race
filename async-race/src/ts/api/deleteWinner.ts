import { WINNERS_URL } from './constants';
import { HTTPMethods } from '../constants';

const fetchDeletedWinner = async (id: number): Promise<object | Error> => {
  try {
    const response: Response = await fetch(
      `${WINNERS_URL}/${id}`,
      {
        method: HTTPMethods.delete,
      },
    );

    return await response.json();
  } catch (error) {
    const err = error as Error;

    return err;
  }
};

export default fetchDeletedWinner;
