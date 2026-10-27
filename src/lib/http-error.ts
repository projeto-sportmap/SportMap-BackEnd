export interface ValidationError {
  path: string;
  message: string;
}

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly errors?: ValidationError[],
  ) {
    super(message);
    this.name = 'HttpError';
  }
}
