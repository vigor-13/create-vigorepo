import inquirer, { QuestionCollection } from 'inquirer';
import { validateDirectory } from '../../utils';
import { CreateActionProps } from './create.type';

export class CreatePrompt {
  private _directory: CreateActionProps;

  constructor(dirctory: CreateActionProps) {
    this._directory = dirctory;
  }

  /**
   * Get directory path from user.
   */
  public getProjectDirectory = async () => {
    const inquirerOption: QuestionCollection = {
      when: !this._directory,
      type: 'input',
      name: 'projectDirectory',
      message: 'Where would you like to create your project?',
      default: './my-project',
      validate: (dir: string) => {
        const { valid, error } = validateDirectory(dir);
        if (!valid && error) return error;
        return true;
      },
      filter: (dir: string) => dir.trim(),
    };

    const projectDirectoryFromPrompt = await inquirer.prompt<{
      projectDirectory: string;
    }>(inquirerOption);

    const { projectDirectory: projectDirectory } = projectDirectoryFromPrompt;

    const result = validateDirectory(
      this._directory ? this._directory : projectDirectory,
    );

    return result;
  };
}
