import { HTTPMethods, EngineStatus } from '../enums';
import { IEngineStartResult } from '../types';
import { ENGINE_URL } from './constants';

const getEngineStartResult = async (id: number): Promise<IEngineStartResult> => {
  try {
    const response: Response | void = await fetch(
      `${ENGINE_URL}?id=${id}&status=${EngineStatus.drive}`,
      {
        method: HTTPMethods.patch,
      },
    );

    return await response.json();
  } catch (error: unknown) {
    return { success: false };
  }
};

export default getEngineStartResult;
