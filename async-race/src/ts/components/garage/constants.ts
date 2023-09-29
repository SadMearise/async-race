import { CAR_SVG } from '../../constants';
import { TSVG } from '../../types';

export const MILLISECONDS_PER_SECOND: number = 1000;
export const GARAGE_CAR_SVG: TSVG = {
  classNames: ['track__car-img', 'car-img', 'car-img_size_big'],
  ...CAR_SVG,
};
