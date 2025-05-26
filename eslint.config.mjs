// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'src/test-utils/supabase-mocks.ts'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // Configuration for non-test files (uses default tsconfig.json)
  {
    languageOptions: {
      parserOptions: {
        project: true, // or ['./tsconfig.json']
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Add any specific rules for non-test files here if needed
    },
  },
  // Override for test files
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked, // Apply type-checked rules
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.spec.json'], // Point to the test-specific tsconfig
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      // Looser rules for test files can be defined here if needed
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-floating-promises': 'off', // Often useful for tests
      '@typescript-eslint/unbound-method': 'off', // For jest.spyOn, etc.
      '@typescript-eslint/strict-boolean-expressions': 'off', // Conditions can be looser in tests
      // Add or remove rules here based on what errors you are seeing
    },
  },
  eslintPluginPrettierRecommended, // Apply Prettier last
  // General settings for all files (or those not covered by specific overrides)
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      sourceType: 'module', // Changed from commonjs, assuming ESM for .ts files
    },
  },
);