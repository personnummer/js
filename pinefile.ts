import { run, log, series } from '@pinefile/pine';
import isCI from 'is-ci';
import { build } from 'esbuild';

const buildOptions = (format: 'cjs' | 'esm') => ({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format,
  outfile: `./dist/${format}/index.js`,
  // Keep `require('personnummer')` returning the class, not `{ default }`.
  ...(format === 'cjs' && {
    footer: { js: 'module.exports = module.exports.default;' },
  }),
});

export default {
  build: async () => {
    await run('rimraf dist');

    log.info('Building types');
    await run('tsc --emitDeclarationOnly');

    log.info('Building cjs');
    await build(buildOptions('cjs'));

    log.info('Building esm');
    await build(buildOptions('esm'));
  },
  test: async (args: { _: string[] }) => {
    const files = isCI
      ? [__dirname + '/dist/cjs', __dirname + '/dist/esm']
      : [__dirname + '/src'];

    await series(
      files.map((file) => async () => {
        log.info(`Running tests with ${file}\n`);
        await run(`FILE=${file} vitest ${args._}`);
      }),
    );
  },
};
