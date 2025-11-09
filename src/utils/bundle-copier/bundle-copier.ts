/**
 * Bundle copier implementation
 * 
 * Copies bundles from detected/source locations to standardized locations
 * Handles both bundle files and asset directories
 */

import * as fs from 'fs';
import * as path from 'path';
import type { BundleCopyOptions, BundleCopyResult } from './types';
import { EXCLUDE_PATTERNS, MAX_FILE_SIZE_BYTES } from './constants';

/**
 * Copy bundle from source to target location
 * 
 * Recursively copies all files and directories, excluding patterns
 */
export async function copyBundle(
  options: BundleCopyOptions
): Promise<BundleCopyResult> {
  try {
    const { sourcePath, targetPath, verbose } = options;
    
    // Validate source exists
    if (!fs.existsSync(sourcePath)) {
      return {
        success: false,
        sourcePath,
        targetPath,
        error: `Source path does not exist: ${sourcePath}`,
      };
    }
    
    // Create target directory if it doesn't exist
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
    
    // Copy all files
    let filesCopied = 0;
    let totalSize = 0;
    
    const stats = fs.statSync(sourcePath);
    
    if (stats.isDirectory()) {
      // Copy directory contents recursively
      const result = await copyDirectoryRecursive(
        sourcePath,
        targetPath,
        verbose
      );
      filesCopied = result.filesCopied;
      totalSize = result.totalSize;
    } else {
      // Copy single file
      const targetFile = path.join(targetPath, path.basename(sourcePath));
      await copyFile(sourcePath, targetFile);
      filesCopied = 1;
      totalSize = stats.size;
    }
    
    return {
      success: true,
      sourcePath,
      targetPath,
      filesCopied,
      totalSize,
    };
  } catch (error) {
    return {
      success: false,
      sourcePath: options.sourcePath,
      targetPath: options.targetPath,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Copy directory recursively
 */
async function copyDirectoryRecursive(
  source: string,
  target: string,
  verbose?: boolean
): Promise<{ filesCopied: number; totalSize: number }> {
  let filesCopied = 0;
  let totalSize = 0;
  
  // Create target directory
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
  }
  
  // Read source directory
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  for (const entry of entries) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);
    
    // Skip excluded files
    if (shouldExclude(entry.name)) {
      if (verbose) {
        console.log(`Skipping: ${entry.name}`);
      }
      continue;
    }
    
    if (entry.isDirectory()) {
      // Recursively copy subdirectory
      const result = await copyDirectoryRecursive(
        sourcePath,
        targetPath,
        verbose
      );
      filesCopied += result.filesCopied;
      totalSize += result.totalSize;
    } else {
      // Copy file
      const stats = fs.statSync(sourcePath);
      
      // Skip files that are too large
      if (stats.size > MAX_FILE_SIZE_BYTES) {
        if (verbose) {
          console.log(
            `Skipping large file: ${entry.name} (${formatBytes(stats.size)})`
          );
        }
        continue;
      }
      
      await copyFile(sourcePath, targetPath);
      filesCopied++;
      totalSize += stats.size;
      
      if (verbose) {
        console.log(`Copied: ${entry.name} (${formatBytes(stats.size)})`);
      }
    }
  }
  
  return { filesCopied, totalSize };
}

/**
 * Copy a single file
 */
async function copyFile(source: string, target: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(target);
    
    readStream.on('error', reject);
    writeStream.on('error', reject);
    writeStream.on('finish', resolve);
    
    readStream.pipe(writeStream);
  });
}

/**
 * Check if file/directory should be excluded
 */
function shouldExclude(name: string): boolean {
  return EXCLUDE_PATTERNS.some((pattern) => {
    if (pattern.startsWith('*.')) {
      const ext = pattern.slice(1);
      return name.endsWith(ext);
    }
    return name === pattern;
  });
}

/**
 * Format bytes as human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Check if two paths are the same (accounting for relative vs absolute)
 */
export function isSamePath(path1: string, path2: string): boolean {
  const resolved1 = path.resolve(path1);
  const resolved2 = path.resolve(path2);
  return resolved1 === resolved2;
}

