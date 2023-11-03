import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { Stream } from 'node:stream';
import { createWriteStream, promises as fs } from 'node:fs';
import got from 'got';
import tar from 'tar';
import chalk from 'chalk';
import { Logger, isExistUrl } from '../../utils';
import { ProjectBuilderProps, TemplateInfo } from '../project-builder';

export class RepositoryLoader {
  private _logger: Logger;
  private _appPath: string;
  private _info: TemplateInfo;
  private _pipeline = promisify(Stream.pipeline);
  private _tempFile: string | null = null;

  constructor(props: ProjectBuilderProps) {
    this._logger = new Logger();
    this._appPath = props.appPath;
    this._info = props.templateInfo;
  }

  private _isExistsInRepository = async (): Promise<boolean> => {
    return isExistUrl(
      `https://api.github.com/repos/vigor-13/create-vigorepo/contents/templates/${encodeURIComponent(
        this._info.templateName,
      )}`,
    );
  };

  private _downloadTar = async () => {
    const url = `https://codeload.github.com/vigor-13/create-vigorepo/tar.gz/main`;
    const tempFile = path.join(
      os.tmpdir(),
      `vigorepo-tempate.temp-${Date.now()}`,
    );
    await this._pipeline(got.stream(url), createWriteStream(tempFile));
    this._tempFile = tempFile;
  };

  private _cloneToAppPath = async () => {
    await tar.extract({
      file: this._tempFile!,
      cwd: this._appPath,
      strip: 3,
      filter: (p: string) =>
        p.includes(`create-vigorepo-main/templates/${this._info.templateName}`),
    });
  };

  private _cleanTempFile = () => {
    fs.unlink(this._tempFile!);
    this._tempFile = null;
  };

  /**
   * 레포지토리에 템플릿이 존재하는지 확인한다.
   */
  public checkTemplate = async () => {
    return this._isExistsInRepository();
  };

  /**
   * 레포지토리에서 템플릿을 다운받아 지정한 경로로 복사한다.
   */
  public loadTemplate = async () => {
    await this._downloadTar();
    await this._cloneToAppPath();
    this._cleanTempFile();
  };
}
