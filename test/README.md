# MindAR.js Testing Guide

This directory contains the test suite for MindAR.js.

## Structure

```
test/
├── unit/           # Unit tests for individual modules
├── integration/    # Integration tests for AR pipeline
└── README.md       # This file
```

## Running Tests

### Run all tests
```bash
npm test
```

### Watch mode (run tests on file change)
```bash
npm run test:watch
```

### UI mode (interactive test runner)
```bash
npm run test:ui
```

### Coverage report
```bash
npm run test:coverage
```

## Writing Tests

### Unit Tests

Unit tests should test individual functions or classes in isolation.

Example:
```javascript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../src/module';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction(input);
    expect(result).toBe(expectedOutput);
  });
});
```

### Integration Tests

Integration tests should test how multiple components work together.

Example:
```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('AR Pipeline Integration', () => {
  let controller;
  
  beforeEach(() => {
    controller = new Controller(config);
  });
  
  it('should process frame correctly', async () => {
    const result = await controller.processFrame(frame);
    expect(result).toBeDefined();
  });
});
```

## Testing Best Practices

1. **Keep tests focused**: Each test should verify one specific behavior
2. **Use descriptive names**: Test names should clearly describe what they test
3. **Arrange-Act-Assert**: Structure tests with clear setup, execution, and verification
4. **Mock external dependencies**: Use mocks for complex dependencies
5. **Test edge cases**: Include tests for boundary conditions and error cases

## Test Coverage Goals

- **Lines**: 70% minimum
- **Functions**: 70% minimum
- **Branches**: 70% minimum
- **Statements**: 70% minimum

Current coverage can be viewed by running:
```bash
npm run test:coverage
```

## Continuous Integration

Tests are automatically run on every push and pull request via GitHub Actions.

See `.github/workflows/ci.yml` for the CI configuration.

## Troubleshooting

### Tests fail with "Cannot find module"
Make sure all dependencies are installed:
```bash
npm install
```

### Canvas errors in tests
The `canvas` package requires system dependencies. Install them with:
```bash
# Ubuntu/Debian
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

### WebGL context errors
Tests run in a happy-dom environment which doesn't support full WebGL.
For WebGL-heavy tests, consider using integration tests with a real browser environment.

## Adding New Tests

1. Create a new test file in the appropriate directory (`unit/` or `integration/`)
2. Name the file `*.test.js` or `*.spec.js`
3. Import testing utilities from `vitest`
4. Write your tests following the structure above
5. Run tests to verify they work
6. Commit the test file

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://testingjavascript.com/)
- [JavaScript Testing Guide](https://github.com/goldbergyoni/javascript-testing-best-practices)
