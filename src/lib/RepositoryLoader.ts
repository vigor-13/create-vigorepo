import chalk from 'chalk';
import { Logger, isExistUrl } from '../utils';
import { TemplateInfo } from './project-builder';

export class RepositoryLoader {
  private _logger: Logger;
  private _info: TemplateInfo;

  constructor(info: TemplateInfo) {
    this._logger = new Logger();
    this._info = info;
  }

  private _isExistsInRepository = async (): Promise<boolean> => {
    return isExistUrl(
      `https://api.github.com/repos/vigor-13/create-vigorepo/contents/templates/${encodeURIComponent(
        this._info.template,
      )}`,
    );
  };

  public loadTemplate = async () => {
    const existsTemplate = await this._isExistsInRepository();
    if (!existsTemplate) {
      this._logger.error(
        `Could not found the ${chalk.red(`"${this._info.template}"`)} template`,
      );
      process.exit(1);
    }
  };
}
