import path from 'node:path';
import chalk from 'chalk';
import { Logger, isOnline } from '../../utils';
import {
  ProjectBuilder,
  GitController,
  PackageController,
  ProjectBuildData,
} from '../../lib';
import { CreatePrompt as Prompt } from './create.prompt';
import { CreateActionOptions, CreateActionProps } from './create.type';

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
    if (!online) {
      this._logger.error(
        'You appear to be offline. Please check your network connection and try again.',
      );
      process.exit(1);
    }
  };

  private _setProjectInfo = async () => {
    const { root, projectName } = await this._prompt.getProjectDirectory();
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
    } catch (error) {
      // TODO: Error handling
    } finally {
      this._spinner.stop();
      this._logger.info('Download Completed!');
    }

    this._projectData = result;
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
      // TODO: Error handling
    } finally {
      this._spinner.stop();
      this._logger.info('dependencies installed');
    }
  };

  public handle = async () => {
    this._logger.log(chalk.bold('\n>>> VIGOREPO\n'));
    this._logger.info(
      "Welcone to Vigorepo! Let's get you set up with a new codebase.",
    );

    await this._checkNetwork();
    await this._setProjectInfo();
    await this._createProject();
    await this._initializeGit();
    await this._installDependencies();

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
