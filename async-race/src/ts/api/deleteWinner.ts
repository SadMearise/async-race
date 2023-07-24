import { WINNERS_URL } from './constants';
import { HTTPMethods } from '../enums';

const getDeletedWinnerPromise = async (id: number): Promise<Record<string, never>> => {
  try {
    const response: Response = await fetch(
      `${WINNERS_URL}/${id}`,
      {
        method: HTTPMethods.delete,
      },
    );

    return await response.json();
  } catch (error: unknown) {
    return {};
  }
};

export default getDeletedWinnerPromise;
