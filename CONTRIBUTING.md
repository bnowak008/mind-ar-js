# Contributing to MindAR.js

Thank you for your interest in contributing to MindAR.js! This document provides guidelines and information for contributors.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Code Quality](#code-quality)
7. [Submitting Changes](#submitting-changes)
8. [Release Process](#release-process)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- System dependencies for canvas (see below)

### System Dependencies

#### Ubuntu/Debian
```bash
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libpixman-1-dev
```

#### macOS
```bash
brew install pkg-config cairo pango libpng jpeg giflib librsvg pixman
```

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/mind-ar-js.git
   cd mind-ar-js
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build Project**
   ```bash
   # Development build
   npm run build-dev
   
   # Production build
   npm run build
   ```

## Making Changes

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions or updates
- `refactor/` - Code refactoring
- `perf/` - Performance improvements

Example: `feature/add-hand-tracking`

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Check formatting
npm run format:check

# Auto-format code
npm run format

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### TypeScript

We provide TypeScript type definitions. When adding new APIs:

1. Update type definitions in `src/*/types.d.ts`
2. Run type checking: `npm run type-check`
3. Test IDE autocomplete manually

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

### Writing Tests

Tests are located in the `test/` directory:

```javascript
import { describe, it, expect } from 'vitest';

describe('MyFeature', () => {
  it('should work correctly', () => {
    // Arrange
    const input = setupInput();
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe(expectedOutput);
  });
});
```

### Test Coverage Goals

- **Lines**: 70% minimum
- **Functions**: 70% minimum
- **Branches**: 70% minimum
- **Statements**: 70% minimum

## Code Quality

### Before Submitting

Run these checks locally:

```bash
# Type check
npm run type-check

# Linting
npm run lint

# Formatting
npm run format:check

# Tests
npm test

# Build
npm run build
```

### Continuous Integration

All pull requests automatically run:
- Multi-version Node.js testing (18.x, 20.x)
- Linting and formatting checks
- Type checking
- Test suite
- Security audits
- Build verification

## Submitting Changes

### Pull Request Process

1. **Update Documentation**
   - Add JSDoc comments
   - Update README if needed
   - Update CHANGELOG.md
   - Update type definitions

2. **Ensure Tests Pass**
   ```bash
   npm test
   npm run lint
   npm run type-check
   npm run build
   ```

3. **Create Pull Request**
   - Descriptive title
   - Clear description of changes
   - Reference related issues
   - Include screenshots for UI changes

4. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Tests added/updated
   - [ ] All tests passing
   - [ ] Manual testing completed
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] No breaking changes
   ```

### Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(face-tracking): add eye blink detection
fix(image-target): resolve memory leak in tracker
docs(readme): update installation instructions
```

### Code Review

Maintainers will review your PR for:
- Code quality and style
- Test coverage
- Documentation
- Performance impact
- Backward compatibility
- Security implications

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

For maintainers releasing new versions:

1. Update CHANGELOG.md
2. Update version in package.json
3. Create git tag
4. Build release artifacts
5. Publish to npm
6. Create GitHub release
7. Update documentation

## Areas for Contribution

### High Priority

- [ ] Expand test coverage (current: infrastructure only)
- [ ] Add JSDoc comments to core modules
- [ ] Performance optimizations
- [ ] Documentation improvements
- [ ] Example applications

### Medium Priority

- [ ] WebAssembly integration
- [ ] Advanced tracking algorithms
- [ ] Browser compatibility testing
- [ ] Mobile optimization
- [ ] Accessibility improvements

### Low Priority

- [ ] Additional examples
- [ ] Video tutorials
- [ ] Translations
- [ ] Community tools

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/hiukim/mind-ar-js/issues)
- **Discussions**: [GitHub Discussions](https://github.com/hiukim/mind-ar-js/discussions)
- **Documentation**: [Official Docs](https://hiukim.github.io/mind-ar-js-doc)

## Recognition

Contributors are recognized in:
- README.md contributors section
- CHANGELOG.md for significant changes
- GitHub contributors page

Thank you for contributing to MindAR.js! 🎉
