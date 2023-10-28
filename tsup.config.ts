import { defineConfig, Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/bin/index.ts'],
  format: ['cjs'],
  clean: true,
  minify: true,
  ...options,
}));
