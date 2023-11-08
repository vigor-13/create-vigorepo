import chalk from 'chalk';
import ora from 'ora';

const theme = {
  info: '#086ddd',
  error: '#e93147',
  warn: '#ec7500',
};

export class Logger {
  private _chalks;

  constructor() {
    this._chalks = {
      info: chalk.hex(theme.info),
      warn: chalk.hex(theme.warn),
      error: chalk.hex(theme.error),
    };
  }

  spinner = (message: string) => {
    return ora({
      text: message,
    });
  };

  log = (...args: Array<unknown>) => {
    console.log(...args);
  };

  info = (...args: Array<unknown>) => {
    this.log(this._chalks.info('🚥'), ...args);
  };

  warn = (...args: Array<unknown>) => {
    console.error(this._chalks.warn('🚥', ...args));
  };

  error = (...args: Array<unknown>) => {
    console.error(this._chalks.error('🚥', ...args));
  };
}
