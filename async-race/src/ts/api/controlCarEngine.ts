import { HTTPMethods, EngineStatus } from '../constants';
import { TEngineOptions } from '../types';
import { ENGINE_URL } from './constants';

const fetchEngineOptions = async (id: number, status: EngineStatus): Promise<TEngineOptions> => {
  const response: Response = await fetch(
    `${ENGINE_URL}?id=${id}&status=${status}`,
    {
      method: HTTPMethods.patch,
    },
  );

  const engineOptions = await response.json();

  return engineOptions;
};

export default fetchEngineOptions;
