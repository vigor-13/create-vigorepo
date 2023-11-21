module.exports = {
  overrides: [
    {
      files: ['*.ts?(x)'],
      extends: ['standard-with-typescript', 'prettier'],
    },
  ],
  ignorePatterns: ['node_modules/', 'dist/'],
};
