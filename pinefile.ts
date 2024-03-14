import { run, log, series } from '@pinefile/pine';
import isCI from 'is-ci';
import { build } from '@frozzare/pkg';

const buildOptions = (format) => ({
  entry: './src/index.ts',
  format,
  outfile: `./dist/${format}/index.js`,
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
  test: async (args) => {
    const files = isCI ? [__dirname + '/dist/cjs', __dirname +'/dist/esm'] : ['./src'];

    await series(
      files.map((file) => async () => {
        log.info(`Running tests with ${file}\n`);
        await run(`FILE=${file} vitest ${args._}`);
      })
    );
  },
};
