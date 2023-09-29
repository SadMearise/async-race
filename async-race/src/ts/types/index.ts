export type TComponentStructure = {
  tagName?: keyof HTMLElementTagNameMap | string;
  classNames?: string[];
  textContent?: string;
  parentNode?: TComponentStructure | null;
  attributes?: Record<string, string>;
};

export type TSVGComponentStructure = {
  tagName: keyof HTMLElementTagNameMap | string;
  xmlns: string;
  classNames?: string[];
  attributes?: Record<string, string>;
};

export type TSubscriber = (data?: string) => void;

export type TState = {
  currentPage: string;
  currentGaragePage: number;
  totalGaragePages: number;
  currentLeaderboardPage: number;
  totalLeaderboardPages: number;
  winner: boolean;
  sortedTime: string;
  sortedWins: string;
};

export type TCar = {
  name: string;
  color: string;
  id: number;
};

export type TCars = {
  cars: TCar[];
  totalCars: number;
};

export type TEngineOptions = {
  distance: number;
  velocity: number;
};

export type TEngineStartResult = {
  success: boolean;
};

export type TCarBody = {
  name: string;
  color: string;
};

export type TWinnerBody = {
  wins: number;
  time: number;
};

export type TWinner = {
  id: number;
  wins: number;
  time: number;
};

export type TWinners = {
  winners: TWinner[];
  totalWinners: number;
};

export type TSVG = {
  classNames?: string[];
  xmlns: string;
  attributes: TSVGAttributes;
  path: TSVGPath;
};

type TSVGAttributes = {
  width: string;
  height: string;
  viewBox: string;
  fill: string;
};

type TSVGPath = {
  attributes: TPathttributes;
};

type TPathttributes = {
  d: string;
};
