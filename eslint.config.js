// @ts-check
import eslint from '@eslint/js'
import pluginImportX from 'eslint-plugin-import-x'
import pluginN from 'eslint-plugin-n'
import pluginRegExp from 'eslint-plugin-regexp'
import globals from 'globals'
import { builtinModules } from 'node:module'
import tseslint from 'typescript-eslint'

// Some rules work better with typechecking enabled, but as enabling it is slow,
// we only do so when linting in IDEs for now. If you want to lint with typechecking
// explicitly, set this to `true` manually.
const shouldTypeCheck = typeof process.env.VSCODE_PID === 'string'

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/*.snap']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  pluginRegExp.configs['flat/recommended'],
  {
    name: 'main',
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022,
        project: shouldTypeCheck ? ['./packages/*/tsconfig.json'] : undefined
      },
      globals: {
        ...globals.es2021,
        ...globals.node
      }
    },
    settings: {
      node: {
        version: '^18.0.0 || ^20.0.0 || >=22.0.0'
      }
    },
    plugins: {
      n: pluginN,
      'import-x': pluginImportX
    },
    rules: {
      'n/no-exports-assign': 'error',
      'n/no-unpublished-bin': 'error',
      'n/no-unsupported-features/es-builtins': 'error',
      'n/no-unsupported-features/node-builtins': 'error',
      'n/process-exit-as-throw': 'error',
      'n/hashbang': 'error',
      eqeqeq: ['warn', 'always', { null: 'never' }],
      'no-debugger': ['error'],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-process-exit': 'off',
      'prefer-const': [
        'warn',
        {
          destructuring: 'all'
        }
      ],

      'n/no-missing-require': [
        'error',
        {
          // for try-catching yarn pnp
          allowModules: ['pnpapi', 'vite'],
          tryExtensions: ['.ts', '.js', '.jsx', '.tsx', '.d.ts']
        }
      ],
      'n/no-extraneous-import': [
        'error',
        {
          allowModules: [
            'vite',
            'less',
            'sass',
            'sass-embedded',
            'lightningcss',
            'vitest',
            'unbuild'
          ]
        }
      ],
      'n/no-extraneous-require': [
        'error',
        {
          allowModules: ['vite']
        }
      ],

      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': [
        'error',
        { allowArgumentsExplicitlyTypedAsAny: true }
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['arrowFunctions'] }
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        { allowInterfaces: 'with-single-extends' }
      ],
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-extra-semi': 'off',
      '@typescript-eslint/no-extra-semi': 'off', // conflicts with prettier
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', disallowTypeAnnotations: false }
      ],
      // disable rules set in @typescript-eslint/stylistic which conflict with current code
      // we should discuss if we want to enable these as they encourage consistent code
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/prefer-function-type': 'off',

      'import-x/no-nodejs-modules': [
        'error',
        { allow: builtinModules.map((mod) => `node:${mod}`) }
      ],
      'import-x/no-duplicates': 'error',
      'import-x/order': 'error',
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: false
        }
      ],

      'regexp/prefer-regexp-exec': 'error',
      'regexp/prefer-regexp-test': 'error',
      // in some cases using explicit letter-casing is more performant than the `i` flag
      'regexp/use-ignore-case': 'off'
    }
  },
  {
    name: 'disables/dts',
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/consistent-indexed-object-style': 'off',
      '@typescript-eslint/triple-slash-reference': 'off'
    }
  }
)
