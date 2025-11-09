/**
 * Android build output detection utility
 * 
 * Detects Android build outputs for both Expo and non-Expo React Native apps
 * Checks multiple common build output locations
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ANDROID_BUILD_PATHS,
  ANDROID_VARIANTS,
  EXPO_ANDROID_PATHS,
  MAX_BUILD_AGE_MS,
} from './constants';
import type { DetectionResult, DetectionSource } from './types';

/**
 * Detect Android build output directory
 * 
 * Searches for recent Android build outputs in common locations:
 * - android/app/build/generated/assets/react/<variant>/
 * - android/app/build/intermediates/assets/<variant>/
 * - .expo/android/... (for Expo)
 * 
 * @param projectRoot - Project root directory
 * @param isExpo - Whether project uses Expo
 * @returns Detection result with path and metadata
 */
export function detectAndroidBuildOutput(
  projectRoot: string,
  isExpo: boolean
): DetectionResult | null {
  const searchPaths = isExpo
    ? [...EXPO_ANDROID_PATHS, ...ANDROID_BUILD_PATHS]
    : ANDROID_BUILD_PATHS;
  
  // Check each path with variants
  for (const basePath of searchPaths) {
    // Try base path first
    const result = checkPath(projectRoot, basePath, isExpo);
    if (result) {
      return result;
    }
    
    // Try with variants (release, debug, staging)
    for (const variant of ANDROID_VARIANTS) {
      const variantPath = basePath.replace(/\/(release|debug)$/, `/${variant}`);
      const variantResult = checkPath(projectRoot, variantPath, isExpo);
      if (variantResult) {
        return variantResult;
      }
    }
  }
  
  return null;
}

/**
 * Check if a specific path exists and is recent
 */
function checkPath(
  projectRoot: string,
  relativePath: string,
  isExpo: boolean
): DetectionResult | null {
  const fullPath = path.join(projectRoot, relativePath);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  // Check if directory is recent (not stale)
  const stats = fs.statSync(fullPath);
  const ageMs = Date.now() - stats.mtimeMs;
  
  if (ageMs > MAX_BUILD_AGE_MS) {
    // Build is too old, likely stale
    return null;
  }
  
  // Check if directory has bundle files
  if (!hasBundleFiles(fullPath)) {
    return null;
  }
  
  const source: DetectionSource = isExpo
    ? 'expo_build' as DetectionSource
    : 'android_build' as DetectionSource;
  
  return {
    detected: true,
    path: fullPath,
    description: `Android build output (${isExpo ? 'Expo' : 'standard'})`,
    source,
  };
}

/**
 * Check if directory contains bundle-related files
 */
function hasBundleFiles(dirPath: string): boolean {
  try {
    const files = fs.readdirSync(dirPath);
    
    // Look for index.android.bundle or similar files
    return files.some((file) =>
      file.includes('.bundle') ||
      file.includes('index.android') ||
      file === 'assets' ||
      file === 'res'
    );
  } catch (error) {
    return false;
  }
}

/**
 * Get the most recently modified Android build directory
 * 
 * If multiple build outputs exist, returns the most recent one
 */
export function getMostRecentAndroidBuild(
  projectRoot: string,
  isExpo: boolean
): DetectionResult | null {
  const searchPaths = isExpo
    ? [...EXPO_ANDROID_PATHS, ...ANDROID_BUILD_PATHS]
    : ANDROID_BUILD_PATHS;
  
  let mostRecent: { result: DetectionResult; mtime: number } | null = null;
  
  for (const basePath of searchPaths) {
    const fullPath = path.join(projectRoot, basePath);
    
    if (!fs.existsSync(fullPath)) {
      continue;
    }
    
    const stats = fs.statSync(fullPath);
    const ageMs = Date.now() - stats.mtimeMs;
    
    if (ageMs > MAX_BUILD_AGE_MS) {
      continue;
    }
    
    if (!hasBundleFiles(fullPath)) {
      continue;
    }
    
    if (!mostRecent || stats.mtimeMs > mostRecent.mtime) {
      const source: DetectionSource = isExpo
        ? 'expo_build' as DetectionSource
        : 'android_build' as DetectionSource;
      
      mostRecent = {
        result: {
          detected: true,
          path: fullPath,
          description: `Android build output (${isExpo ? 'Expo' : 'standard'}, most recent)`,
          source,
        },
        mtime: stats.mtimeMs,
      };
    }
  }
  
  return mostRecent?.result ?? null;
}

