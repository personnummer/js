import eslint from '@eslint/js';
import compat from 'eslint-plugin-compat';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  // Tests run in Node only, so browser compatibility is checked for the library code.
  { ...compat.configs['flat/recommended'], ignores: ['src/*.test.ts'] },
  {
    settings: {
      // No polyfills are shipped, so check ES built-ins too, not only web APIs.
      lintAllEsApis: true,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
);
