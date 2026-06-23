import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

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
  const tempOutputPath = path.join(tempDir, `${tempId}_out_${originalFilename}`);

  try {
    // 1. Temporarily store file
    await fs.writeFile(tempInputPath, buffer);

    const gltfpackPath = process.platform === "win32"
      ? path.join(process.cwd(), "binaries", "gltfpack.exe")
      : path.join(process.cwd(), "binaries", "gltfpack-linux");

    // 2. Execute gltfpack
    const args = [
      '-i', tempInputPath,
      '-o', tempOutputPath,
      '-cc',
      '-si', '0.15',
      '-kn',
      '-km'
    ];

    try {
      // 120s timeout
      await execFileAsync(gltfpackPath, args, { timeout: 120000 });
      
      // 3. Read optimized output
      const optimizedBuffer = await fs.readFile(tempOutputPath);
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
    } catch (optError) {
      console.warn("gltfpack optimization failed, falling back to original:", optError);
      // Fallback strategy: return the original buffer
      return {
        optimizedBuffer: buffer,
        originalSize,
        optimizedSize: originalSize,
        reductionPercentage: "0.00",
        durationMs: Date.now() - startTime
      };
    }
  } catch (error) {
    console.error("GLB processing error:", error);
    // Ultimate fallback if disk operations failed
    return {
      optimizedBuffer: buffer,
      originalSize,
      optimizedSize: originalSize,
      reductionPercentage: "0.00",
      durationMs: Date.now() - startTime
    };
  } finally {
    // 4. Delete Temporary Files
    await fs.unlink(tempInputPath).catch(() => {});
    await fs.unlink(tempOutputPath).catch(() => {});
  }
}
