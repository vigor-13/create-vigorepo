import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

interface GitControllerProps {
  appPath: string;
}

export class GitController {
  private readonly _appPath: string;

  constructor(props: GitControllerProps) {
    this._appPath = props.appPath;
    process.chdir(this._appPath);
  }

  private readonly _isInGitRepository = (): boolean => {
    try {
      cp.execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
      return true;
    } catch (_) {}

    return false;
  };

  private readonly _gitCommit = (commitMessage: string): void => {
    cp.execSync(
      `git commit --author="bot <vigor13.dev@gmail.com>" -am "${commitMessage}"`,
      { stdio: 'ignore' },
    );
  };

  public gitInit = (props: { commitMessage: string }): boolean => {
    let didInit = false;

    try {
      if (this._isInGitRepository()) return false;

      cp.execSync('git init', { stdio: 'ignore' });
      cp.execSync('git add -A', { stdio: 'ignore' });
      didInit = true;
      cp.execSync('git checkout -b main', { stdio: 'ignore' });

      this._gitCommit(props.commitMessage);
      return true;
    } catch (error) {
      if (didInit) {
        try {
          fs.rmSync(path.join(this._appPath, '.git'));
        } catch (_) {}
      }

      return false;
    }
  };

  public gitCommit = (commitMessage: string): boolean => {
    try {
      cp.execSync('git add -A', { stdio: 'ignore' });
      this._gitCommit(commitMessage);
      return true;
    } catch (error) {
      return false;
    }
  };
}
