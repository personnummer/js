import { run, log, series } from '@pinefile/pine';
import isCI from 'is-ci';
import { build } from 'esbuild';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';

const buildOptions = (format: 'cjs' | 'esm') => ({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format,
  outfile: `./dist/${format}/index.${format === 'esm' ? 'mjs' : 'js'}`,
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

    // Node16/NodeNext reads `.d.ts` next to a CJS file as CJS, so each format
    // gets its own declarations matching what it exports at runtime.
    log.info('Building per-format types');
    const types = './dist/types/index.d.ts';
    copyFileSync(types, './dist/esm/index.d.mts');
    writeFileSync(
      './dist/cjs/index.d.ts',
      readFileSync(types, 'utf8').replace(
        /export declare const valid[^]*$/,
        'export = Personnummer;\n',
      ),
    );
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
