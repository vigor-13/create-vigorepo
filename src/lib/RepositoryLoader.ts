import chalk from 'chalk';
import { Logger, isExistUrl } from '../utils';
import { TemplateInfo } from './project-builder';
import path from 'node:path';

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
        this._info.templateName,
      )}`,
    );
  };

  /**
   * 존재하는 템플릿인지 확인한다.
   */
  public checkTemplate = async () => {
    return this._isExistsInRepository();
  };

  /**
   * 깃헙에서 템플릿을 로드한다.
   */
  public loadTemplate = async () => {};
}
