import path from 'node:path';
import fs from 'node:fs';
import chalk from 'chalk';
import {
  CustomError,
  Logger,
  isOnline,
  printWelcomeMessage,
} from '../../utils';
import {
  ProjectBuilder,
  GitController,
  PackageController,
  type ProjectBuildData,
} from '../../lib';
import { CreatePrompt as Prompt } from './create.prompt';
import {
  type CreateActionOptions,
  type CreateActionProps,
} from './create.type';
import {
  InitializeError,
  NetworkConnectionError,
  WrongDirectoryError,
} from './create.error';

interface ProjectInfo {
  name: string; // ex. projectName
  template: string; // ex. default | app | lib
  directory: string; // ex. /Users/hoho/some/directory/projectName
}

export class CreateAction {
  private readonly _logger = new Logger();
  private readonly _spinner = this._logger.spinner('');
  private readonly _prompt: Prompt;
  private readonly _options: CreateActionOptions;
  private _gitController: GitController | null = null;
  private _projectInfo: ProjectInfo | null = null;
  private _projectData: ProjectBuildData | null = null;

  constructor(directory: CreateActionProps, options: CreateActionOptions) {
    this._options = options;
    this._prompt = new Prompt(directory);
  }

  private readonly _checkNetwork = async (): Promise<void> => {
    const online = await isOnline();
    if (!online) throw new NetworkConnectionError();
  };

  private readonly _setProjectInfo = async (): Promise<void> => {
    const { root, projectName, error } =
      await this._prompt.getProjectDirectory();
    if (error !== undefined) throw new WrongDirectoryError(error);

    let template = 'default';
    if (this._options.template !== undefined) template = this._options.template;

    this._projectInfo = {
      name: projectName,
      template,
      directory: root,
    };
  };

  private readonly _createProject = async (): Promise<void> => {
    if (this._projectInfo === null) return;

    const projectBuilder = new ProjectBuilder({
      appPath: this._projectInfo.directory,
      templateInfo: {
        username: 'vigor-13',
        repoName: 'create-vigorepo',
        branch: 'main',
        templateName: this._projectInfo.template,
      },
    });

    let result: Awaited<ReturnType<typeof projectBuilder.createProject>>;

    try {
      this._logger.info(
        `Downloading files from ${chalk.cyan(
          this._projectInfo.template,
        )} template. This might take a moment.`,
      );
      this._spinner.text = 'Downloading files...';
      this._spinner.start();
      result = await projectBuilder.createProject();
      this._projectData = result;
      this._spinner.stop();
      this._logger.info('Download Completed!');
    } catch (error) {
      this._spinner.stop();
      if (error instanceof CustomError) throw error;
    }
  };

  private readonly _initializeGit = async (): Promise<void> => {
    if (this._projectData === null) return;

    const gitController = new GitController({
      appPath: this._projectData.cdPath,
    });

    gitController.gitInit({
      commitMessage: 'feat: Initial commit',
    });

    this._gitController = gitController;
  };

  private readonly _installDependencies = async (): Promise<void> => {
    if (this._projectData === null) return;
    if (this._gitController === null) return;

    const packageController = new PackageController({
      appPath: this._projectData.cdPath,
    });

    this._logger.info(
      'Installing packages. This might take a couple of minutes.',
    );
    try {
      this._spinner.text = 'Installing dependencies...';
      this._spinner.start();
      await packageController.installDependencies();
      this._gitController.gitCommit('build: install dependencies');
    } catch (error: any) {
      throw new InitializeError(
        `Something went worng while installing dependencies, ${error}`,
      );
    } finally {
      this._spinner.stop();
      this._logger.info('dependencies installed');
    }
  };

  private readonly _cleanup = (): void => {
    if (this._projectData !== null) {
      fs.rmSync(this._projectData.cdPath, { recursive: true, force: true });
    }
  };

  private readonly _errorHandler = (error: any): void => {
    if (error instanceof CustomError) {
      this._logger.error(error.message);
      if (error.isCleanup !== undefined && error.isCleanup) this._cleanup();
      if (error.exitCode !== undefined) process.exit(error.exitCode);
      return;
    }

    this._logger.error(error);
    process.exit(1);
  };

  public handle = async (): Promise<void> => {
    printWelcomeMessage();

    try {
      await this._checkNetwork();
      await this._setProjectInfo();
      await this._createProject();
      await this._initializeGit();
      await this._installDependencies();
    } catch (error) {
      this._errorHandler(error);
    }

    if (this._projectInfo === null) return;

    const relativeProjectDir = path.relative(
      process.cwd(),
      this._projectInfo.directory,
    );

    const projectDirIsCurrentDir = relativeProjectDir === '';

    if (projectDirIsCurrentDir) {
      this._logger.info(`${chalk.bold('Success!')} Your new project is ready.`);
    } else {
      this._logger.info(
        `${chalk.bold(
          'Success!',
        )} Created a new project at "${relativeProjectDir}".`,
      );
    }
  };
}
