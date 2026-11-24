import { spawnSync } from 'node:child_process';
import { copyFileSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

const run = (command, args) => {
  const { status, error } = spawnSync(command, args, { stdio: 'inherit' });
  if (error) throw error;
  if (status !== 0) process.exit(status ?? 1);
};

const buildOptions = (format) => ({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  format,
  target: 'es2022',
  outfile: `./dist/${format}/index.${format === 'esm' ? 'mjs' : 'js'}`,
  // Keep `require('personnummer')` returning the class, not `{ default }`.
  ...(format === 'cjs' && {
    footer: { js: 'module.exports = module.exports.default;' },
  }),
});

rmSync('./dist', { recursive: true, force: true });

console.log('Building types');
run('tsc', ['--emitDeclarationOnly']);

console.log('Building cjs');
await build(buildOptions('cjs'));

console.log('Building esm');
await build(buildOptions('esm'));

// Node16/NodeNext reads `.d.ts` next to a CJS file as CJS, so each format
// gets its own declarations matching what it exports at runtime.
console.log('Building per-format types');
const types = './dist/types/index.d.ts';
copyFileSync(types, './dist/esm/index.d.mts');
writeFileSync(
  './dist/cjs/index.d.ts',
  readFileSync(types, 'utf8').replace(
    /export declare const valid[^]*$/,
    'export = Personnummer;\n',
  ),
);
