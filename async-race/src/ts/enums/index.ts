export enum HTTPMethods {
  get = 'GET',
  post = 'POST',
  delete = 'DELETE',
  put = 'PUT',
  patch = 'PATCH',
}

export enum Pages {
  leaderboard = 'leaderboard',
  garage = 'garage',
}

export enum StatusCodes {
  code200 = 200,
  code201 = 201,
  code400 = 400,
  code404 = 404,
  code429 = 429,
  code500 = 500,
}

export enum EngineStatus {
  started = 'started',
  stopped = 'stopped',
  drive = 'drive',
}

export enum Order {
  asc = 'ASC',
  desc = 'DESC',
}
