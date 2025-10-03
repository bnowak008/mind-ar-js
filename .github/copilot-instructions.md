# MindAR - GitHub Copilot Instructions

## Project Overview

MindAR is a web augmented reality library that provides:
- **Image Tracking**: Track and overlay AR content on custom target images
- **Face Tracking**: Real-time face tracking for virtual try-on and face effects
- Pure JavaScript implementation with WebGL acceleration
- Integration with popular frameworks (Three.js, A-Frame)

## Technology Stack

- **Language**: JavaScript (ES6+ modules)
- **3D Graphics**: Three.js (peer dependency)
- **Computer Vision**: 
  - TensorFlow.js for image processing
  - MediaPipe for face tracking
- **Build Tool**: Vite 5
- **Module Format**: ES modules (type: "module" in package.json)

## Project Structure

```
src/
├── image-target/       # Image tracking module
│   ├── controller.js   # Main AR controller
│   ├── compiler.js     # Image target compiler
│   ├── three.js        # Three.js integration
│   ├── aframe.js       # A-Frame integration
│   ├── matching/       # Feature matching algorithms
│   ├── estimation/     # Pose estimation
│   └── utils/          # Utility functions
├── face-target/        # Face tracking module
│   ├── controller.js   # Face tracking controller
│   ├── three.js        # Three.js integration
│   └── aframe.js       # A-Frame integration
└── ui/                 # UI components (loading, scanning overlays)

examples/               # Example applications
├── image-tracking/     # Image tracking demos
└── face-tracking/      # Face tracking demos

testing/                # Manual testing pages (not automated tests)
```

## Key Components

### Image Tracking
- `MindARThree`: Three.js wrapper class for image tracking
- `Controller`: Core AR tracking logic
- `Compiler`: Converts target images into trackable feature sets

### Face Tracking
- `MindARThree`: Three.js wrapper class for face tracking (separate from image-target)
- Uses MediaPipe for face mesh detection
- Supports face landmarks and face mesh overlay

## Development Workflow

### Build Commands
```bash
npm run dev        # Start development server with hot reload
npm run watch      # Build and watch for changes
npm run build-dev  # Development build (with source maps)
npm run build      # Production build
```

### Build Output
- `dist-dev/`: Development builds with inline source maps
- `dist/`: Production builds (minified)
- Builds both ES modules and IIFE formats for browser compatibility

### Testing
- No automated test suite; testing is done manually with HTML test pages in `testing/` and `examples/`
- Test pages use development builds from `dist-dev/`
- Manual testing involves checking AR tracking in browser with webcam

## Code Style and Conventions

### Module Structure
- Use ES6 modules with explicit imports/exports
- External dependencies: Three.js modules use `three/addons/` path alias
- No default exports; use named exports

### Class Patterns
- Main AR classes: `MindARThree` (for Three.js integration)
- Constructor accepts configuration object with named parameters
- Async initialization: `await start()` method pattern
- Cleanup: `stop()` method for resource cleanup

### Key APIs
```javascript
// Image Tracking
const mindarThree = new MindARThree({
  container: document.querySelector('#container'),
  imageTargetSrc: 'targets.mind',
  maxTrack: 1, // number of simultaneous targets
  filterMinCF: null, // Kalman filter parameters
  filterBeta: null,
  uiLoading: "yes", // UI overlay options
  uiScanning: "yes",
  uiError: "yes"
});

await mindarThree.start();
const anchor = mindarThree.addAnchor(targetIndex);
anchor.group.add(object3D); // Add Three.js objects

// Face Tracking
const mindarThree = new MindARThree({
  container: document.querySelector('#container'),
  filterMinCF: null,
  filterBeta: null,
  userDeviceId: null, // Camera device IDs
  environmentDeviceId: null
});
```

### Important Patterns
- Anchors: Groups that follow tracked targets/faces
- Matrix updates: Use `matrixAutoUpdate = false` and manual matrix setting
- Camera switching: `shouldFaceUser` flag for front/back camera
- CSS3D rendering: Separate CSS renderer alongside WebGL renderer

## Browser Compatibility

- Target browsers: Modern browsers with WebGL support
- Android: Chrome (recommended)
- iOS: Safari (recommended)
- Requires camera/webcam access
- HTTPS required for camera access (except localhost)

## Important Files to Preserve

- `src/`: Core library source code
- `examples/`: Demo applications that showcase library features
- `dist/` and `dist-dev/`: Build outputs (gitignored, generated)
- `package.json`: Dependencies and build scripts
- `vite.config.*.js`: Build configurations for different environments
- `custom_tfjs/` and `custom_tfjs_config.json`: Custom TensorFlow.js build configuration

## Common Tasks

### Adding New Features
1. Identify if it's image-target or face-target related
2. Implement in appropriate module under `src/`
3. Update Three.js wrapper if API changes
4. Add example in `examples/` directory
5. Build and test manually with example page

### Debugging
- Use `npm run dev` for development server with HTTPS
- Check browser console for errors
- Verify camera permissions in browser
- Test in recommended browsers (Chrome/Android, Safari/iOS)

### Dependencies
- Keep Three.js as peer dependency (users provide their own version)
- TensorFlow.js and MediaPipe are direct dependencies
- Minimize external dependencies for better performance

## Notes for Contributors

- This is a computer vision library; changes may affect tracking accuracy
- Performance is critical; avoid blocking main thread
- WebGL and Web Workers are used for performance optimization
- The library maintains feature parity with commercial AR SDKs
- Documentation lives in separate repository: `hiukim.github.io/mind-ar-js-doc`

## Coding Guidelines

1. **Minimize bundle size**: AR libraries run in browsers; keep dependencies minimal
2. **Async operations**: Use async/await for initialization and heavy operations
3. **Resource cleanup**: Always implement proper cleanup in `stop()` methods
4. **Browser APIs**: Use standard Web APIs (WebGL, Canvas, MediaDevices)
5. **Performance**: Profile changes; AR needs 60fps for smooth experience
6. **Compatibility**: Test changes across browsers (Chrome, Safari, Firefox)

## Related Resources

- Documentation: https://hiukim.github.io/mind-ar-js-doc
- Image Compiler Tool: https://hiukim.github.io/mind-ar-js-doc/tools/compile
- Examples: https://hiukim.github.io/mind-ar-js-doc/examples/summary
