import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        MutationObserver: 'readonly',
        CustomEvent: 'readonly',
        Event: 'readonly',
        fetch: 'readonly',
        Promise: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        history: 'readonly',
        location: 'readonly',
        HTMLElement: 'readonly',
        NodeList: 'readonly',
      },
    },
    rules: {
      // Возможные ошибки
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'no-duplicate-imports': 'error',

      // Лучшие практики
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // Запрет глобальных переменных — используем модули
      'no-global-assign': 'error',
      'no-implicit-globals': 'error',

      // Стиль кода
      'arrow-body-style': ['error', 'as-needed'],
      'curly': ['error', 'all'],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'vite.config.js'],
  },
];
