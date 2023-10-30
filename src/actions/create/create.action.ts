import path from 'node:path';
import chalk from 'chalk';
import { Logger } from '../../utils';
import { CreatePrompt as Prompt } from './create.prompt';
import { CreateActionProps } from './create.type';

export const createAction = async (directory: CreateActionProps) => {
  const logger = new Logger();
  const prompt = new Prompt(directory);

  logger.log(chalk.bold('\n>>> VIGOREPO\n'));
  logger.info("Welcone to Vigorepo! Let's get you set up with a new codebase");
  logger.log();

  /**
   * TODO: 온라인 여부 체크 및 패키지 매니저 옵션 체크
   * - 오프라인이면 프로세스 종료
   */

  /**
   * 프롬프트로 프로젝트 생성 디렉토리 가져오기
   */
  const { root, projectName } = await prompt.getProjectDirectory();
  const relativeProjectDir = path.relative(process.cwd(), root);
  const projectDirIsCurrentDir = relativeProjectDir === '';
};
