import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

import reactPlugin from '@eslint-react/eslint-plugin'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import pluginImport from 'eslint-plugin-import'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'src/components/ui']),
  {
    name: 'app/source',
    files: ['src/**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactPlugin.configs.recommended,
      jsxA11y.flatConfigs.recommended,
      reactRefresh.configs.vite,
      prettierConfig,
    ],
    plugins: {
      import: pluginImport,
      'unused-imports': pluginUnusedImports,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      'import/no-duplicates': 'error',
    },
  },
  {
    name: 'app/tests',
    files: ['src/**/*.{test,spec}.{ts,tsx}'],
    languageOptions: { globals: globals.vitest },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    name: 'app/config-files',
    files: ['*.config.{ts,js}'],
    extends: [...tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
  {
    name: 'app/e2e',
    files: ['tests/**/*.ts'],
    extends: [...tseslint.configs.recommended],
    languageOptions: { globals: globals.node },
  },
])
