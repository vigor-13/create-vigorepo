import path from 'node:path';
import chalk from 'chalk';
import * as fs from 'fs-extra';
import { Logger, PackageJson, isWriteable } from '../../utils';
import { RepositoryLoader } from '../repository-loader';

export interface ProjectBuilderProps {
  appPath: string;
  templateInfo: TemplateInfo;
}

export type TemplateInfo = {
  username: 'vigor-13';
  repoName: 'create-vigorepo';
  branch: 'main';
  templateName: string;
};

export interface ProjectBuildData {
  cdPath: string;
  hasPackageJson: boolean;
  availableScripts: string[];
}

export class ProjectBuilder {
  private _logger: Logger;
  private _appPath: string;
  private _templateInfo: TemplateInfo;
  private _repositoryLoader: RepositoryLoader;
  private _appName: string;

  constructor(props: ProjectBuilderProps) {
    this._logger = new Logger();
    this._repositoryLoader = new RepositoryLoader(props);
    this._templateInfo = props.templateInfo;
    this._appPath = props.appPath;
    this._appName = path.basename(this._appPath);
  }

  private _checkIsValidTemplate = async () => {
    const isExistTemplate = await this._repositoryLoader.checkTemplate();
    if (!isExistTemplate) {
      this._logger.error(
        `Could not found the ${chalk.red(
          `"${this._templateInfo.templateName}"`,
        )} template`,
      );
      process.exit(1);
    }
  };

  private _checkIsWriteableDirectory = async () => {
    if (!(await isWriteable(path.dirname(this._appPath)))) {
      this._logger.error(
        'The application path is not writable, please check folder permissions and try again.',
      );
      this._logger.error(
        'It is likely you do not have write permissions for this folder.',
      );
      process.exit(1);
    }
  };

  private _createProjectDirectory = async () => {
    this._checkIsWriteableDirectory();
    try {
      await fs.mkdir(this._appPath, { recursive: true });
    } catch (error) {
      this._logger.error('Unable to create project directory');
      this._logger.error(error);
      process.exit(1);
    }
  };

  private _cloneTemplateFromRepository = async () => {
    try {
      await this._repositoryLoader.loadTemplate();
    } catch (error) {
      this._logger.error(error);
      process.exit(1);
    }
  };

  private _extractProjectData = async () => {
    const rootPackageJsonPath = path.join(this._appPath, 'package.json');
    const hasPackageJson = fs.existsSync(rootPackageJsonPath);
    const availableScripts = [];

    if (hasPackageJson) {
      let packageJsonContent;
      try {
        packageJsonContent = fs.readJsonSync(
          rootPackageJsonPath,
        ) as PackageJson;
      } catch (error) {}

      if (packageJsonContent) {
        availableScripts.push(...Object.keys(packageJsonContent.scripts || {}));
      }
    }

    return {
      cdPath: this._appPath,
      hasPackageJson,
      availableScripts,
    };
  };

  public createProject = async () => {
    await this._checkIsValidTemplate();
    await this._createProjectDirectory();
    process.chdir(this._appPath);
    await this._cloneTemplateFromRepository();
    const projectData = this._extractProjectData();
    return projectData;
  };
}
