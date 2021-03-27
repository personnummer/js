const { build } = require('esbuild');

const { FORMAT } = process.env;

const options = {
  entryPoints: ['./src/index.ts'],
  //  minify: process.env.NODE_ENV === 'production',
  bundle: true,
  format: FORMAT,
  outfile: `./dist/${FORMAT}/index.js`,
};

build(options).catch((err) => {
  process.stderr.write(err.stderr);
  process.exit(1);
});
