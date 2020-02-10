import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const commonConfig = {
  input: 'src/index.js',
  external: ['react'],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }),
    commonjs({
      ignoreGlobal: true,
    }),
  ]
};

export default [
  {
    ...commonConfig,
    output: {
      dir: 'lib/cjs',
      format: 'cjs'
    },
  },
  {
    ...commonConfig,
    output: {
      dir: 'lib/esm',
      format: 'esm'
    },
  },
];