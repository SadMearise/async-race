import { HTTPMethods, StatusCodes, EngineStatus } from '../enums';
import { TEngineOptions } from '../types';
import { ENGINE_URL } from './constants';

const getEngineOptions = async (id: number, status: EngineStatus): Promise<TEngineOptions> => {
  const response: Response = await fetch(
    `${ENGINE_URL}?id=${id}&status=${status}`,
    {
      method: HTTPMethods.patch,
    },
  );

  if (response.status === StatusCodes.code400) {
    throw new Error('Wrong parameters: "id" should be any positive number, "status" should be "started", "stopped" or "drive"');
  } else if (response.status === StatusCodes.code404) {
    throw new Error('Car with such id was not found in the garage.');
  }

  return response.json();
};

export default getEngineOptions;
