const isCI = require('is-ci');
const { run, log, series } = require('@pinefile/pine');
const { build } = require('esbuild');

const buildOptions = (format) => ({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format,
  outfile: `./dist/${format}/index.js`,
});

module.exports = {
  build: async () => {
    await run('rimraf dist');

    log.info('Building types');
    await run('tsc --emitDeclarationOnly');

    log.info('Building cjs');
    await build(buildOptions('cjs'));

    log.info('Building esm');
    await build(buildOptions('esm'));
  },
  test: async () => {
    const files = isCI ? ['./dist/cjs', './dist/esm'] : ['./src'];

    await series(
      files.map((file) => async () => {
        log.info(`Running tests with ${file}\n`);
        await run(`FILE=${file} jest`);
      })
    );
  },
};
