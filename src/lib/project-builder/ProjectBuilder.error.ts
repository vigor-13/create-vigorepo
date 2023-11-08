import { CustomError } from '../../utils';

export class ProjectBuildError extends CustomError {
  exitCode?: number = 1;
  isCleanup?: boolean = true;

  constructor(message?: string) {
    super(message ? message : 'Something went worng');
    Object.setPrototypeOf(this, ProjectBuildError.prototype);
  }
}
