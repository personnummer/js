import { run, log, series } from '@pinefile/pine';
import isCI from 'is-ci';
import { build as esbuild } from 'esbuild';
import fs from 'fs';

const buildOptions = (format) => ({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format,
  outfile: `./dist/${format}/index.js`,
  write: false,
});

const build = async (options) => {
  fs.mkdirSync(`./dist/${options.format}`);

  const result = await esbuild(options);

  for (let out of result.outputFiles) {
    fs.writeFileSync(
      out.path,
      options.format === 'cjs'
        ? // fixes #468
          out.text.replace('module.exports = __toCommonJS(src_exports);', '') +
            'module.exports = src_default;'
        : out.text
    );
  }
};

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
