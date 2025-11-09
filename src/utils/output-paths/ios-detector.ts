/**
 * iOS build output detection utility
 * 
 * Detects iOS build outputs for both Expo and non-Expo React Native apps
 * Checks Xcode build directories and DerivedData locations
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { EXPO_IOS_PATHS, IOS_BUILD_PATHS, MAX_BUILD_AGE_MS } from './constants';
import type { DetectionResult, DetectionSource } from './types';

/**
 * Detect iOS build output directory
 * 
 * Searches for recent iOS build outputs in common locations:
 * - ios/build/Build/Products/Release-iphoneos/
 * - ios/build/Build/Products/Debug-iphonesimulator/
 * - .expo/ios/build/ (for Expo)
 * - Xcode DerivedData (if accessible)
 * 
 * @param projectRoot - Project root directory
 * @param isExpo - Whether project uses Expo
 * @returns Detection result with path and metadata
 */
export function detectIOSBuildOutput(
  projectRoot: string,
  isExpo: boolean
): DetectionResult | null {
  const searchPaths = isExpo
    ? [...EXPO_IOS_PATHS, ...IOS_BUILD_PATHS]
    : IOS_BUILD_PATHS;
  
  // Check project-local build paths first
  for (const basePath of searchPaths) {
    const result = checkPath(projectRoot, basePath, isExpo);
    if (result) {
      return result;
    }
  }
  
  // Try DerivedData as last resort (non-Expo only)
  if (!isExpo) {
    const derivedDataResult = checkDerivedData(projectRoot);
    if (derivedDataResult) {
      return derivedDataResult;
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
    : 'ios_build' as DetectionSource;
  
  return {
    detected: true,
    path: fullPath,
    description: `iOS build output (${isExpo ? 'Expo' : 'standard'})`,
    source,
  };
}

/**
 * Check Xcode DerivedData directory
 * 
 * Xcode stores build outputs in ~/Library/Developer/Xcode/DerivedData/
 * This function attempts to find the most recent build for this project
 */
function checkDerivedData(projectRoot: string): DetectionResult | null {
  const derivedDataPath = path.join(
    os.homedir(),
    'Library/Developer/Xcode/DerivedData'
  );
  
  if (!fs.existsSync(derivedDataPath)) {
    return null;
  }
  
  try {
    // Get project name from ios/*.xcodeproj or ios/*.xcworkspace
    const iosPath = path.join(projectRoot, 'ios');
    if (!fs.existsSync(iosPath)) {
      return null;
    }
    
    const iosFiles = fs.readdirSync(iosPath);
    const projectFile = iosFiles.find(
      (file) => file.endsWith('.xcodeproj') || file.endsWith('.xcworkspace')
    );
    
    if (!projectFile) {
      return null;
    }
    
    const projectName = projectFile.replace(/\.(xcodeproj|xcworkspace)$/, '');
    
    // Look for DerivedData folders matching project name
    const derivedDataFiles = fs.readdirSync(derivedDataPath);
    const matchingFolders = derivedDataFiles.filter((folder) =>
      folder.startsWith(projectName)
    );
    
    if (matchingFolders.length === 0) {
      return null;
    }
    
    // Find most recent build
    let mostRecentBuild: {
      path: string;
      mtime: number;
    } | null = null;
    
    for (const folder of matchingFolders) {
      const buildPath = path.join(
        derivedDataPath,
        folder,
        'Build/Products'
      );
      
      if (!fs.existsSync(buildPath)) {
        continue;
      }
      
      const stats = fs.statSync(buildPath);
      const ageMs = Date.now() - stats.mtimeMs;
      
      if (ageMs > MAX_BUILD_AGE_MS) {
        continue;
      }
      
      if (!mostRecentBuild || stats.mtimeMs > mostRecentBuild.mtime) {
        mostRecentBuild = {
          path: buildPath,
          mtime: stats.mtimeMs,
        };
      }
    }
    
    if (!mostRecentBuild) {
      return null;
    }
    
    return {
      detected: true,
      path: mostRecentBuild.path,
      description: 'iOS build output (DerivedData)',
      source: 'ios_build' as DetectionSource,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Check if directory contains bundle-related files
 */
function hasBundleFiles(dirPath: string): boolean {
  try {
    const files = fs.readdirSync(dirPath);
    
    // Look for .app bundles or main.jsbundle
    return files.some((file) =>
      file.endsWith('.app') ||
      file.includes('.jsbundle') ||
      file.includes('main.') ||
      file === 'assets'
    );
  } catch (error) {
    return false;
  }
}

/**
 * Get the most recently modified iOS build directory
 * 
 * If multiple build outputs exist, returns the most recent one
 */
export function getMostRecentIOSBuild(
  projectRoot: string,
  isExpo: boolean
): DetectionResult | null {
  const searchPaths = isExpo
    ? [...EXPO_IOS_PATHS, ...IOS_BUILD_PATHS]
    : IOS_BUILD_PATHS;
  
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
        : 'ios_build' as DetectionSource;
      
      mostRecent = {
        result: {
          detected: true,
          path: fullPath,
          description: `iOS build output (${isExpo ? 'Expo' : 'standard'}, most recent)`,
          source,
        },
        mtime: stats.mtimeMs,
      };
    }
  }
  
  return mostRecent?.result ?? null;
}

