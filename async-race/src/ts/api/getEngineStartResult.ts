import { HTTPMethods, EngineStatus } from '../constants';
import { TEngineStartResult } from '../types';
import { ENGINE_URL } from './constants';

const fetchEngineStartResult = async (id: number): Promise<TEngineStartResult> => {
  try {
    const response: Response = await fetch(
      `${ENGINE_URL}?id=${id}&status=${EngineStatus.drive}`,
      {
        method: HTTPMethods.patch,
      },
    );

    return await response.json();
  } catch (error) {
    return { success: false };
  }
};

export default fetchEngineStartResult;
