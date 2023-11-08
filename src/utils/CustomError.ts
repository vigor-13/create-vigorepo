export abstract class CustomError extends Error {
  abstract exitCode?: number;
  abstract isCleanup?: boolean;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
