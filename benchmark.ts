#!/usr/bin/env bun

import { performance } from "perf_hooks";
import { spawn } from "child_process";

interface BenchmarkResult {
  name: string;
  duration: number;
  memory: number;
  success: boolean;
}

class PerformanceBenchmark {
  private results: BenchmarkResult[] = [];

  async runBuildBenchmark(): Promise<BenchmarkResult> {
    console.log("🏗️  Running build performance benchmark...");
    
    const startTime = performance.now();
    const startMemory = process.memoryUsage();
    
    return new Promise((resolve) => {
      const buildProcess = spawn("bun", ["run", "build.ts", "prod"], {
        stdio: "pipe",
        shell: true
      });
      
      buildProcess.on("close", (code) => {
        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        const duration = endTime - startTime;
        const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;
        
        const result: BenchmarkResult = {
          name: "Production Build",
          duration,
          memory: memoryUsed,
          success: code === 0
        };
        
        this.results.push(result);
        resolve(result);
      });
    });
  }

  async runDevBuildBenchmark(): Promise<BenchmarkResult> {
    console.log("🔧 Running development build benchmark...");
    
    const startTime = performance.now();
    const startMemory = process.memoryUsage();
    
    return new Promise((resolve) => {
      const buildProcess = spawn("bun", ["run", "build.ts", "dev"], {
        stdio: "pipe",
        shell: true
      });
      
      buildProcess.on("close", (code) => {
        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        const duration = endTime - startTime;
        const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;
        
        const result: BenchmarkResult = {
          name: "Development Build",
          duration,
          memory: memoryUsed,
          success: code === 0
        };
        
        this.results.push(result);
        resolve(result);
      });
    });
  }

  async runTestBenchmark(): Promise<BenchmarkResult> {
    console.log("🧪 Running test performance benchmark...");
    
    const startTime = performance.now();
    const startMemory = process.memoryUsage();
    
    return new Promise((resolve) => {
      const testProcess = spawn("bun", ["test"], {
        stdio: "pipe",
        shell: true
      });
      
      testProcess.on("close", (code) => {
        const endTime = performance.now();
        const endMemory = process.memoryUsage();
        const duration = endTime - startTime;
        const memoryUsed = endMemory.heapUsed - startMemory.heapUsed;
        
        const result: BenchmarkResult = {
          name: "Test Suite",
          duration,
          memory: memoryUsed,
          success: code === 0
        };
        
        this.results.push(result);
        resolve(result);
      });
    });
  }

  generateReport(): void {
    console.log("\n📊 Performance Benchmark Report");
    console.log("=" .repeat(50));
    
    this.results.forEach(result => {
      const status = result.success ? "✅" : "❌";
      const duration = (result.duration / 1000).toFixed(2);
      const memory = (result.memory / 1024 / 1024).toFixed(2);
      
      console.log(`${status} ${result.name}`);
      console.log(`   Duration: ${duration}s`);
      console.log(`   Memory: ${memory} MB`);
      console.log("");
    });
    
    // Calculate totals
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const totalMemory = this.results.reduce((sum, r) => sum + r.memory, 0);
    const successCount = this.results.filter(r => r.success).length;
    
    console.log("📈 Summary");
    console.log(`   Total Duration: ${(totalDuration / 1000).toFixed(2)}s`);
    console.log(`   Total Memory: ${(totalMemory / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Success Rate: ${successCount}/${this.results.length} (${((successCount / this.results.length) * 100).toFixed(1)}%)`);
  }
}

async function main() {
  console.log("🚀 Starting MindAR Performance Benchmark");
  console.log("=" .repeat(50));
  
  const benchmark = new PerformanceBenchmark();
  
  try {
    await benchmark.runDevBuildBenchmark();
    await benchmark.runBuildBenchmark();
    await benchmark.runTestBenchmark();
    
    benchmark.generateReport();
    
    console.log("🎉 Benchmark completed successfully!");
  } catch (error) {
    console.error("❌ Benchmark failed:", error);
    process.exit(1);
  }
}

if (import.meta.main) {
  main().catch(console.error);
}
