import { HTTPMethods, EngineStatus } from '../enums';
import { TEngineOptions } from '../types';
import { ENGINE_URL } from './constants';

const getEngineOptions = async (id: number, status: EngineStatus): Promise<TEngineOptions> => {
  const response: Response = await fetch(
    `${ENGINE_URL}?id=${id}&status=${status}`,
    {
      method: HTTPMethods.patch,
    },
  );

  return response.json();
};

export default getEngineOptions;
