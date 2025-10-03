import {defineConfig,build} from 'vite'
import * as fs from 'fs/promises';
import * as path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl'

const outDir = 'dist-dev'

const moduleConfig={
    mode: 'development',
    assetsInclude:'**/*.html',
    base:'./',
    plugins:[
        basicSsl()
    ],
    build: {
        outDir: outDir,
        emptyOutDir:false,
        sourcemap:'inline' ,
        lib: {
            fileName:"[name]",
            entry:'index.js',
            formats:['es']
        },
        rollupOptions:{
            external:(id)=>(id==='three'||id.includes('three/examples/jsm/')||id.includes('three/addons/')),
            input:{
                'mindar-image': './src/image-target/index.js',
                'mindar-image-three': './src/image-target/three.js',
                'mindar-face': './src/face-target/index.js',
                'mindar-face-three': './src/face-target/three.js',
            }
        },
    },
    resolve:{
        alias:{
            'three/addons/':'three/examples/jsm/'
        }
    }
};
const faceAframeConfig=defineConfig({
    mode: 'development',
    build: {
        outDir: outDir,
        emptyOutDir:false,
        sourcemap:'inline' ,
        minify: false,
        lib: {
            name:"MINDAR",
            fileName:"[name]",
            entry:'index.js',
            formats:['iife']
        },
        rollupOptions:{
            input:{
                'mindar-face-aframe': './src/face-target/aframe.js',
            },
           
        }
    }
})
/** @type {import('vite').UserConfig} */
const imageAframeConfig=defineConfig({
    mode: 'development',
    build: {
        outDir: outDir,
        emptyOutDir:false,
        sourcemap:'inline' ,
        minify: false,
        lib: {
            name:"MINDAR",
            fileName:"[name]",
            entry:'index.js',
            formats:['iife'],

        },
        rollupOptions:{
            input:{
                'mindar-image-aframe': './src/image-target/aframe.js'
            }
        }
    }
})

export default defineConfig(async ({ command, mode }) => {
    // Safer directory cleanup - only remove if it exists and is not the current directory
    try {
        const stats = await fs.stat(outDir);
        if (stats.isDirectory() && path.resolve(outDir) !== process.cwd()) {
            await fs.rm(outDir, {recursive: true, force: true});
        }
    } catch (error) {
        // Directory doesn't exist, which is fine
        if (error.code !== 'ENOENT') {
            console.error('Error cleaning output directory:', error);
        }
    }

    if (command === 'build') {
        // Build configs sequentially to avoid race conditions
        await build(imageAframeConfig);
        await build(faceAframeConfig);
        
        // Safer file renaming with error handling and sequential processing
        try {
            const files = await fs.readdir(outDir);
            // Process files sequentially to avoid race conditions
            for (const filename of files) {
                if (filename.includes(".iife.js") && !filename.includes(".iife.js.map")) {
                    const oldPath = path.join(outDir, filename);
                    const newName = filename.replace(".iife.js", ".js");
                    const newPath = path.join(outDir, newName);
                    
                    // Check if target file doesn't already exist
                    try {
                        await fs.access(newPath);
                        console.warn(`Skipping rename: ${newName} already exists`);
                    } catch {
                        // Target doesn't exist, safe to rename
                        console.log(filename, "->", newName);
                        await fs.rename(oldPath, newPath);
                    }
                }
            }
        } catch (error) {
            console.error('Error during file renaming:', error);
            throw error;
        }
    }
    return moduleConfig
  })
