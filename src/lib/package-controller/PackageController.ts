import execa from 'execa';
import { Logger } from '../../utils';

interface PackageControllerProps {
  appPath: string;
}

export class PackageController {
  private _logger: Logger;
  private _appPath: string;

  constructor(props: PackageControllerProps) {
    this._logger = new Logger();
    this._appPath = props.appPath;
  }

  public installDependencies = async () => {
    try {
      await execa('pnpm', ['install', '--fix-lockfile'], {
        cwd: this._appPath,
      });
    } catch (error) {
      this._logger.error('failed to install dependencies');
      throw error;
    }
  };
}
