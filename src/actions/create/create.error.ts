import { CustomError } from '../../utils';

export class NetworkConnectionError extends CustomError {
  exitCode?: number = 1;
  isCleanup?: boolean = false;

  constructor() {
    super(
      'You appear to be offline. Please check your network connection and try again.',
    );
    Object.setPrototypeOf(this, NetworkConnectionError.prototype);
  }
}

export class WrongDirectoryError extends CustomError {
  exitCode?: number = 1;
  isCleanup?: boolean = false;

  constructor(message?: string) {
    super(
      message
        ? message
        : 'Something went worng - please try a different location',
    );
    Object.setPrototypeOf(this, WrongDirectoryError.prototype);
  }
}

export class InitializeError extends CustomError {
  exitCode?: number = 1;
  isCleanup?: boolean = false;

  constructor(message?: string) {
    super(message ? message : 'Something went worng');
    Object.setPrototypeOf(this, InitializeError.prototype);
  }
}
