import path from 'node:path';
import fs, { exists } from 'fs-extra';
import chalk from 'chalk';
import { isFolderEmpty } from './isFolderEmpty';

export interface validateDirectoryResponse {
  valid: boolean;
  root: string;
  projectName: string;
  error?: string;
}

export const validateDirectory = (
  directory: string,
): validateDirectoryResponse => {
  const root = path.resolve(directory);
  const projectName = path.basename(root);
  const isExists = fs.existsSync(root);
  const stat = fs.lstatSync(root, { throwIfNoEntry: false });

  // Check if it is a directory or not
  if (stat && !stat.isDirectory()) {
    return {
      valid: false,
      root,
      projectName,
      error: `${chalk.dim(
        projectName,
      )} is not a directory - please try a different location`,
    };
  }

  // Check whether there is a conflict or not
  if (isExists) {
    const { isEmpty, conflicts } = isFolderEmpty(root);

    if (!isEmpty) {
      return {
        valid: false,
        root,
        projectName,
        error: `${chalk.dim(projectName)} (${root}) has ${
          conflicts.length
        } conflicting ${
          conflicts.length === 1 ? 'file' : 'files'
        } - please try a different location`,
      };
    }
  }

  return {
    valid: true,
    root,
    projectName,
  };
};
