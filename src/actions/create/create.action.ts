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
  ProjectBuildData,
} from '../../lib';
import { CreatePrompt as Prompt } from './create.prompt';
import { CreateActionOptions, CreateActionProps } from './create.type';
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
  private _logger = new Logger();
  private _spinner = this._logger.spinner('');
  private _prompt: Prompt;
  private _gitController: GitController | null = null;
  private _options: CreateActionOptions;
  private _projectInfo: ProjectInfo | null = null;
  private _projectData: ProjectBuildData | null = null;

  constructor(directory: CreateActionProps, options: CreateActionOptions) {
    this._options = options;
    this._prompt = new Prompt(directory);
  }

  private _checkNetwork = async () => {
    const online = await isOnline();
    if (!online) throw new NetworkConnectionError();
  };

  private _setProjectInfo = async () => {
    const {
      root,
      projectName,
      error,
    } = await this._prompt.getProjectDirectory();

    if (error) throw new WrongDirectoryError(error);

    this._projectInfo = {
      name: projectName,
      template: this._options.template ? this._options.template : 'default',
      directory: root,
    };
  };

  private _createProject = async () => {
    if (!this._projectInfo) return;

    const projectBuilder = new ProjectBuilder({
      appPath: this._projectInfo.directory,
      templateInfo: {
        username: 'vigor-13',
        repoName: 'create-vigorepo',
        branch: 'main',
        templateName: this._projectInfo.template,
      },
    });

    let result = {} as Awaited<ReturnType<typeof projectBuilder.createProject>>;

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

  private _initializeGit = async () => {
    if (!this._projectData) return;

    const gitController = new GitController({
      appPath: this._projectData.cdPath,
    });

    gitController.gitInit({
      commitMessage: 'feat: Initial commit',
    });

    this._gitController = gitController;
  };

  private _installDependencies = async () => {
    if (!this._projectData || !this._gitController) return;

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
    } catch (error) {
      throw new InitializeError(
        `Something went worng while installing dependencies, ${error}`,
      );
    } finally {
      this._spinner.stop();
      this._logger.info('dependencies installed');
    }
  };

  private _cleanup = async () => {
    if (this._projectData?.cdPath) {
      fs.rmSync(this._projectData.cdPath, { recursive: true, force: true });
    }
  };

  private _errorHandler = (error: any) => {
    if (error instanceof CustomError) {
      this._logger.error(error.message);
      if (error.isCleanup) this._cleanup();
      if (error.exitCode) process.exit(error.exitCode);
      return;
    }

    this._logger.error(error);
    process.exit(1);
  };

  public handle = async () => {
    // this._logger.log(chalk.bold('\n>>> VIGOREPO\n'));
    // this._logger.info(
    //   "Welcone to Vigorepo! Let's get you set up with a new codebase.",
    // );
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

    const relativeProjectDir = path.relative(
      process.cwd(),
      this._projectInfo!.directory,
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
