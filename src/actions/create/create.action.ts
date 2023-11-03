import path from 'node:path';
import chalk from 'chalk';
import { Logger, isOnline } from '../../utils';
import { ProjectBuilder, GitController, PackageController } from '../../lib';
import { CreatePrompt as Prompt } from './create.prompt';
import { CreateActionOptions, CreateActionProps } from './create.type';

export const createAction = async (
  directory: CreateActionProps,
  options: CreateActionOptions,
) => {
  const logger = new Logger();
  const spinner = logger.spinner('');
  const prompt = new Prompt(directory);

  logger.log(chalk.bold('\n>>> VIGOREPO\n'));
  logger.info("Welcone to Vigorepo! Let's get you set up with a new codebase.");

  /**
   * 네트워크 상태 체크
   */
  const online = await isOnline();
  if (!online) {
    logger.error(
      'You appear to be offline. Please check your network connection and try again.',
    );
    process.exit(1);
  }

  /**
   * 프롬프트로 프로젝트 생성 디렉토리 가져오기
   */
  const { root, projectName } = await prompt.getProjectDirectory();
  const relativeProjectDir = path.relative(process.cwd(), root);
  const projectDirIsCurrentDir = relativeProjectDir === '';
  const projectBuilder = new ProjectBuilder({
    appPath: root,
    templateInfo: {
      username: 'vigor-13',
      repoName: 'create-vigorepo',
      branch: 'main',
      templateName: options.template ? options.template : 'default',
    },
  });

  /**
   * 템플릿 다운받기
   */
  let projectData = {} as Awaited<
    ReturnType<typeof projectBuilder.createProject>
  >;
  try {
    logger.info(
      `Downloading files from ${chalk.cyan(
        options.template,
      )} template. This might take a moment.`,
    );
    spinner.text = 'Downloading files...';
    spinner.start();
    projectData = await projectBuilder.createProject();
  } catch (error) {
    // TODO: Error handling
  } finally {
    spinner.stop();
    logger.info('Download Completed!');
  }

  /**
   * 프로젝트 Git 초기화
   */
  const gitController = new GitController({
    appPath: projectData.cdPath,
  });
  gitController.gitInit({
    commitMessage: 'feat: Initial commit',
  });

  /**
   * 프로젝트 install 실행
   */
  const packageController = new PackageController({
    appPath: projectData.cdPath,
  });
  logger.info('Installing packages. This might take a couple of minutes.');
  try {
    spinner.text = 'Installing dependencies...';
    spinner.start();
    await packageController.installDependencies();
    gitController.gitCommit('build: install dependencies');
  } catch (error) {
    // TODO: Error handling
  } finally {
    spinner.stop();
    logger.info('dependencies installed');
  }

  if (projectDirIsCurrentDir) {
    logger.info(`${chalk.bold('Success!')} Your new Vigorepo is ready.`);
  } else {
    logger.info(
      `${chalk.bold(
        'Success!',
      )} Created a new Vigorepo at "${relativeProjectDir}".`,
    );
  }
};
