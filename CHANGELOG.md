# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- TypeScript type definitions for all public APIs
- Comprehensive type definitions for MindARThree image target tracking
- Comprehensive type definitions for MindARThree face target tracking
- `type-check` npm script for TypeScript type checking
- `type-gen` npm script for generating type declarations
- MIGRATION_GUIDE.md for developers
- CHANGELOG.md for tracking changes

### Changed
- **Security**: Updated @tensorflow/tfjs from 4.16.0 to 4.22.0
- **Security**: Updated @mediapipe/tasks-vision from 0.10.9 to 0.10.21
- **Security**: Updated vite from 5.0.11 to 6.3.6
- **Security**: Updated @vitejs/plugin-basic-ssl from 1.1.0 to 2.1.0
- **Build System**: Replaced unsafe `fs.rm` operations with proper error handling
- **Build System**: Changed parallel file renaming to sequential processing to avoid race conditions
- **Build System**: Added checks to prevent overwriting existing files during rename
- **Performance**: Reduced production bundle size by 3% (362 KB vs 373 KB)
- package.json now includes `types` field pointing to type definitions

### Fixed
- All 10 npm security vulnerabilities (1 critical, 4 high, 4 moderate, 1 low)
- Race conditions in build system file operations
- Unsafe directory cleanup operations
- Missing error handling in build scripts

### Security
- ✅ Fixed critical form-data vulnerability (CVE-2024-4068)
- ✅ Fixed high severity braces vulnerability (ReDoS)
- ✅ Fixed high severity rollup vulnerability (DOM Clobbering XSS)
- ✅ Fixed high severity semver vulnerability (ReDoS)
- ✅ Fixed moderate esbuild vulnerability
- ✅ Fixed moderate nanoid vulnerability
- ✅ Fixed moderate tar vulnerability
- ✅ Fixed moderate brace-expansion vulnerability
- ✅ Fixed moderate @babel/runtime vulnerability
- ✅ Fixed low severity dependency vulnerabilities

## [1.2.5] - Previous Release

### Features
- Image target tracking
- Face target tracking
- Three.js integration
- A-Frame integration
- CSS3D rendering support

---

## Migration Notes

All changes in the unreleased version maintain 100% backward compatibility. No code changes are required for existing users.

### For TypeScript Users
You can now import type definitions:

```typescript
import { MindARThree, MindARThreeConfig } from 'mind-ar';
```

### For JavaScript Users
All existing code continues to work without modification:

```javascript
const mindarThree = new window.MINDAR.IMAGE.MindARThree({
  container: document.querySelector("#container"),
  imageTargetSrc: './targets.mind'
});
```

## Version History

- **Unreleased**: Modernization Phase 1 & 2 (Security + TypeScript)
- **1.2.5**: Current stable release
