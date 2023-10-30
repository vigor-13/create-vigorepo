import fs from 'fs-extra';

const VALID_FILES = [
  '.DS_Store',
  '.git',
  '.gitattributes',
  '.gitignore',
  '.gitlab-ci.yml',
  '.hg',
  '.hgcheck',
  '.hgignore',
  '.idea',
  '.npmignore',
  '.travis.yml',
  'LICENSE',
  'Thumbs.db',
  'docs',
  'mkdocs.yml',
  'npm-debug.log',
  'yarn-debug.log',
  'yarn-error.log',
  'yarnrc.yml',
  '.yarn',
];

interface isFolderEmptyResponse {
  isEmpty: boolean;
  conflicts: Array<string>;
}

export const isFolderEmpty = (directory: string): isFolderEmptyResponse => {
  const conflicts = fs
    .readdirSync(directory)
    .filter((file) => !VALID_FILES.includes(file))
    .filter((file) => !file.endsWith('.iml')); // Support IntelliJ IDEA-based editors

  return { isEmpty: conflicts.length === 0, conflicts };
};
