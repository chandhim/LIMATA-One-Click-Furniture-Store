import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
// @ts-ignore
import gltfPipeline from 'gltf-pipeline';

const { processGlb } = gltfPipeline;

export interface OptimizationResult {
  optimizedBuffer: Buffer;
  originalSize: number;
  optimizedSize: number;
  reductionPercentage: string;
  durationMs: number;
}

export async function optimizeGlb(
  buffer: Buffer,
  originalFilename: string
): Promise<OptimizationResult> {
  const startTime = Date.now();
  const originalSize = buffer.length;

  const tempDir = path.join(process.cwd(), 'uploads', 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  const tempId = crypto.randomBytes(16).toString('hex');
  const tempInputPath = path.join(tempDir, `${tempId}_in_${originalFilename}`);

  try {
    // 1. Temporarily store file
    await fs.writeFile(tempInputPath, buffer);

    // 2. Read it back
    const fileBuffer = await fs.readFile(tempInputPath);

    // 3. Optimize / Compress GLB using Draco
    const options = {
      dracoOptions: {
        compressionLevel: 7, // Good balance of compression and speed
      },
    };

    // Promise.race to respect the 120s timeout requirement
    const optimizationPromise = processGlb(fileBuffer, options);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Optimization timeout exceeded 120 seconds")), 120000);
    });

    const results = await Promise.race([optimizationPromise, timeoutPromise]) as { glb: Buffer };
    const optimizedBuffer = results.glb;
    const optimizedSize = optimizedBuffer.length;

    const durationMs = Date.now() - startTime;
    const reductionPercentage = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(2);

    return {
      optimizedBuffer,
      originalSize,
      optimizedSize,
      reductionPercentage,
      durationMs
    };
  } catch (error) {
    console.error("GLB Optimization failed:", error);
    throw new Error(`Optimization failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  } finally {
    // 4. Delete Temporary Files
    try {
      await fs.unlink(tempInputPath);
    } catch (e) {
      console.error(`Failed to delete temporary file ${tempInputPath}:`, e);
    }
  }
}
