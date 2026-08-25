/**
 * ESLint flat configuration (ESLint 10).
 *
 * - Uses @eslint/js recommended preset.
 * - Wires eslint-plugin-mocha with Mocha-aware rules (blocks .only in CI via
 *   the mocha/no-exclusive-tests error).
 * - Turns off formatting rules conflicting with Prettier via eslint-config-prettier.
 */
import js from '@eslint/js';
import mocha from 'eslint-plugin-mocha';
import prettier from 'eslint-config-prettier';

export default [
  // Ignore generated/build artifacts.
  {
    ignores: [
      'node_modules/**',
      'reports/**',
      'allure-results/**',
      'allure-report/**',
      'coverage/**',
      '.husky/**',
    ],
  },

  // Base rules for all JavaScript files.
  {
    files: ['**/*.js'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser + Node globals commonly used in this project.
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
      },
    },
  },

  // Mocha-aware rules for test files (including root hooks and setup).
  {
    files: ['test/**/*.js'],
    ...mocha.configs.recommended,
    rules: {
      ...mocha.configs.recommended.rules,
      // Failing builds if `.only` is accidentally left in a spec.
      'mocha/no-exclusive-tests': 'error',
    },
  },

  // Disable Prettier-conflicting stylistic rules.
  prettier,
];
