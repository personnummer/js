import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const isCI = Boolean(process.env.CI) && process.env.CI !== 'false';

// Locally the tests run against the sources; in CI against both built formats.
const targets = isCI ? ['dist/cjs', 'dist/esm'] : ['src'];

for (const target of targets) {
  const file = root + target;
  console.log(`Running tests with ${file}\n`);

  const { status, error } = spawnSync('vitest', process.argv.slice(2), {
    stdio: 'inherit',
    env: { ...process.env, FILE: file },
  });
  if (error) throw error;
  if (status !== 0) process.exit(status ?? 1);
}
