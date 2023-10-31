import path from 'node:path';
import chalk from 'chalk';
import { Logger, isOnline } from '../../utils';
import { CreatePrompt as Prompt } from './create.prompt';
import { VALID_TEMPLATE } from './create.constants';
import { CreateActionOptions, CreateActionProps } from './create.type';

export const createAction = async (
  directory: CreateActionProps,
  options: CreateActionOptions,
) => {
  const logger = new Logger();
  const prompt = new Prompt(directory);

  logger.log(chalk.bold('\n>>> VIGOREPO\n'));
  logger.info("Welcone to Vigorepo! Let's get you set up with a new codebase.");

  /**
   * 유효한 탬플릿인지 확인
   */
  if (options.template && !VALID_TEMPLATE.includes(options.template)) {
    logger.error(`${options.template} templates does not exist.`);
    process.exit(1);
  }

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

  process.exit(1);
};
