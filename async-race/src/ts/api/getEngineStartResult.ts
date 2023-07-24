import { HTTPMethods, StatusCodes, EngineStatus } from '../enums';
import { IEngineStartResult } from '../types';
import { ENGINE_URL } from './constants';

const getEngineStartResult = async (id: number): Promise<IEngineStartResult> => {
  const response: Response | void = await fetch(
    `${ENGINE_URL}?id=${id}&status=${EngineStatus.drive}`,
    {
      method: HTTPMethods.patch,
    },
  ).catch();

  if (response && response.status === StatusCodes.code200) {
    return response.json();
  }
  if (response && response.status === StatusCodes.code404) {
    return { success: true };
  }

  return { success: false };
};

export default getEngineStartResult;
