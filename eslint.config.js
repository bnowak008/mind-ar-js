import js from '@eslint/js';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist-dev/**',
      '**/dist-types/**',
      '**/coverage/**',
      '**/examples/**',
      '**/testing/**',
      '**/custom_tfjs/**',
      '**/*.min.js',
      'src/libs/**'
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        HTMLElement: 'readonly',
        HTMLVideoElement: 'readonly',
        HTMLCanvasElement: 'readonly',
        Image: 'readonly',
        ImageData: 'readonly',
        URL: 'readonly',
        Blob: 'readonly',
        FileReader: 'readonly',
        Worker: 'readonly',
        WebGLRenderingContext: 'readonly',
        WebGL2RenderingContext: 'readonly',
        
        // Node.js globals (for build scripts)
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        Buffer: 'readonly',
        
        // Testing globals (Vitest)
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        test: 'readonly'
      }
    },
    rules: {
      // Best Practices
      'no-unused-vars': ['off'], // Too many to fix now, enable later
      'no-console': 'off', // Console is used for debugging
      'no-debugger': 'warn',
      
      // Code Quality
      'prefer-const': 'off', // Don't enforce for now
      'no-var': 'off', // Don't enforce for now
      'eqeqeq': ['off'], // Don't enforce for now
      'curly': ['off'], // Don't enforce for now
      
      // Style (minimal enforcement for backward compatibility)
      'semi': ['off'], // Don't enforce for now
      'quotes': ['off'], // Don't enforce for now
      'indent': ['off'], // Don't enforce indentation to avoid massive changes
      'comma-dangle': ['off'], // Allow both styles
      'no-trailing-spaces': ['off'], // Don't enforce for now
      
      // Critical Errors Only
      'no-undef': 'off', // Many global variables, too complex to fix now
      'no-use-before-define': ['off'], // Common pattern in codebase
      'no-constant-condition': 'off', // Used intentionally in some places
      'no-async-promise-executor': 'off', // Common pattern in codebase
      'no-extra-boolean-cast': 'off',
      'no-case-declarations': 'off',
      'no-prototype-builtins': 'off',
      'no-unreachable': 'off',
      'no-empty': 'off'
    }
  }
];
