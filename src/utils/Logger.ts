import chalk from 'chalk';
import ora from 'ora';

const theme = {
  info: '#086ddd',
  error: '#e93147',
  warn: '#ec7500',
};

export class Logger {
  private readonly _chalks;

  constructor() {
    this._chalks = {
      info: chalk.hex(theme.info),
      warn: chalk.hex(theme.warn),
      error: chalk.hex(theme.error),
    };
  }

  spinner = (message: string): ora.Ora => {
    return ora({
      text: message,
    });
  };

  log = (...args: unknown[]): void => {
    console.log(...args);
  };

  info = (...args: unknown[]): void => {
    this.log(this._chalks.info('🚥'), ...args);
  };

  warn = (...args: unknown[]): void => {
    console.error(this._chalks.warn('🚥', ...args));
  };

  error = (...args: unknown[]): void => {
    console.error(this._chalks.error('🚥', ...args));
  };
}
