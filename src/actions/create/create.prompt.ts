import inquirer, { type QuestionCollection } from 'inquirer';
import { validateDirectory, type validateDirectoryResponse } from '../../utils';
import { type CreateActionProps } from './create.type';

export class CreatePrompt {
  private readonly _directory: CreateActionProps;

  constructor(dirctory: CreateActionProps) {
    this._directory = dirctory;
  }

  public getProjectDirectory = async (): Promise<validateDirectoryResponse> => {
    const inquirerOption: QuestionCollection = {
      when: this._directory === undefined,
      type: 'input',
      name: 'projectDirectory',
      message: 'Where would you like to create your project?',
      default: './my-project',
      filter: (dir: string) => dir.trim(),
    };

    const projectDirectoryFromPrompt = await inquirer.prompt<{
      projectDirectory: string;
    }>(inquirerOption);

    const { projectDirectory } = projectDirectoryFromPrompt;
    const result = validateDirectory(this._directory ?? projectDirectory);

    return result;
  };
}
