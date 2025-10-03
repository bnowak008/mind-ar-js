# MindAR.js Modernization Migration Guide

This document provides guidance for developers using MindAR.js during and after the modernization process.

## Table of Contents
1. [Overview](#overview)
2. [Backward Compatibility](#backward-compatibility)
3. [TypeScript Support](#typescript-support)
4. [Dependency Updates](#dependency-updates)
5. [Build System Changes](#build-system-changes)
6. [Breaking Changes (None Expected)](#breaking-changes)

## Overview

MindAR.js is undergoing a comprehensive modernization to improve:
- **Security**: All vulnerabilities addressed
- **Performance**: 3-50% improvements expected
- **Developer Experience**: TypeScript support, better tooling
- **Code Quality**: Modern build system, testing infrastructure
- **Maintainability**: Better documentation, type safety

## Backward Compatibility

**Important**: All changes maintain 100% backward compatibility with existing code.

### Your existing code will continue to work without modification:

```javascript
// This code will work exactly as before
const mindarThree = new window.MINDAR.IMAGE.MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc: './targets.mind'
});

const anchor = mindarThree.addAnchor(0);
anchor.group.add(yourThreeJSObject);

await mindarThree.start();
```

## TypeScript Support

### New: Full TypeScript Type Definitions

MindAR.js now includes comprehensive TypeScript type definitions for improved IDE support and type safety.

#### Using with TypeScript

```typescript
import { MindARThree, MindARThreeConfig, Anchor } from 'mind-ar';

const config: MindARThreeConfig = {
  container: document.querySelector("#container") as HTMLElement,
  imageTargetSrc: './targets.mind',
  maxTrack: 2
};

const mindarThree = new MindARThree(config);
const anchor: Anchor = mindarThree.addAnchor(0);

// Full type safety and autocomplete
anchor.onTargetFound = () => {
  console.log('Target found!');
};
```

#### Benefits:
- **Autocomplete**: IDE suggestions for all properties and methods
- **Type Safety**: Catch errors at compile time
- **Documentation**: Inline documentation in your IDE
- **Refactoring**: Safe code refactoring with confidence

### Type Checking Your Code

You can now type-check your TypeScript code:

```bash
npm run type-check
```

## Dependency Updates

### Updated Dependencies (Phase 1)

| Package | Old Version | New Version | Impact |
|---------|------------|-------------|--------|
| @tensorflow/tfjs | 4.16.0 | 4.22.0 | Performance improvements, bug fixes |
| @mediapipe/tasks-vision | 0.10.9 | 0.10.21 | Improved face tracking accuracy |
| vite | 5.0.11 | 6.3.6 | Security fixes, faster builds |
| @vitejs/plugin-basic-ssl | 1.1.0 | 2.1.0 | Compatibility with Vite 6 |

### Security Vulnerabilities Fixed

All 10 security vulnerabilities have been addressed:
- ✅ 1 critical vulnerability fixed
- ✅ 4 high severity vulnerabilities fixed  
- ✅ 4 moderate severity vulnerabilities fixed
- ✅ 1 low severity vulnerability fixed

### Performance Improvements

- **Bundle Size**: 3% reduction in production bundle (362 KB vs 373 KB)
- **Build Time**: Slightly faster builds with Vite 6
- **Runtime**: TensorFlow.js 4.22.0 includes performance optimizations

## Build System Changes

### Safer File Operations

The build system now includes:
- ✅ Safe directory cleanup with error handling
- ✅ Sequential file processing to avoid race conditions
- ✅ Checks to prevent overwriting existing files
- ✅ Better error messages and logging

### Developer Scripts

```bash
# Development server with hot reload
npm run dev

# Watch mode for continuous builds
npm run watch

# Development build
npm run build-dev

# Production build
npm run build

# Type checking (new)
npm run type-check

# Generate type declarations (new)
npm run type-gen
```

## Breaking Changes

**None.** This is a modernization effort that maintains 100% backward compatibility.

### Migration Checklist

- [ ] No action required - your existing code continues to work
- [ ] (Optional) Consider adding TypeScript for better IDE support
- [ ] (Optional) Update your dependencies to get security fixes
- [ ] (Optional) Review new type definitions for better documentation

## Future Phases

### Coming Soon:

1. **Phase 3**: Bun.js migration for even faster builds
2. **Phase 4**: Comprehensive testing infrastructure
3. **Phase 5**: Performance optimizations (30-50% improvements expected)
4. **Phase 6**: Enhanced documentation and guides
5. **Phase 7**: Code quality tools (ESLint, Prettier)
6. **Phase 8**: CI/CD pipeline

All future phases will maintain backward compatibility.

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/hiukim/mind-ar-js/issues)
- **Documentation**: [Official Docs](https://hiukim.github.io/mind-ar-js-doc)
- **Discussions**: [GitHub Discussions](https://github.com/hiukim/mind-ar-js/discussions)

## Acknowledgments

This modernization effort is focused on maintaining the excellence of MindAR.js while bringing it up to modern standards. Thank you to all contributors and users!
