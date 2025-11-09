/**
 * Main output path resolver
 * 
 * Resolves output paths with the following priority:
 * 1. User-provided path (--outputDir)
 * 2. Auto-detected build output (Android/iOS)
 * 3. Default visible directory (./dota/bundles/<platform>)
 * 
 * Supports both Expo and non-Expo React Native apps
 */

import * as path from 'path';
import { detectAndroidBuildOutput } from './android-detector';
import {
  DEFAULT_ANDROID_OUTPUT,
  DEFAULT_IOS_OUTPUT,
  DEFAULT_OUTPUT_DIR,
  STANDARDIZED_ANDROID_OUTPUT,
  STANDARDIZED_IOS_OUTPUT,
} from './constants';
import { detectExpo } from './expo-detector';
import { detectIOSBuildOutput } from './ios-detector';
import { DetectionSource, type DetectionResult, type PathResolverOptions, type Platform } from './types';

/**
 * Resolve output path with intelligent defaults and auto-detection
 * 
 * Priority:
 * 1. User-provided path (highest priority)
 * 2. Auto-detected build output
 * 3. Default visible directory (fallback)
 * 
 * @param options - Resolution options
 * @returns Detection result with resolved path
 */
export function resolveOutputPath(
  options: PathResolverOptions
): DetectionResult {
  const projectRoot = options.projectRoot ?? process.cwd();
  
  // Priority 1: User-provided path (highest priority)
  if (options.userOutputDir) {
    const absolutePath = path.isAbsolute(options.userOutputDir)
      ? options.userOutputDir
      : path.join(projectRoot, options.userOutputDir);
    
    return {
      detected: false,
      path: absolutePath,
      description: 'User-provided output directory',
      source: DetectionSource.USER_PROVIDED,
    };
  }
  
  // Detect project type (Expo vs standard React Native)
  const projectInfo = detectExpo(projectRoot);
  
  if (options.verbose) {
    console.log(
      `Project type: ${projectInfo.isExpo ? 'Expo' : 'Standard React Native'}`
    );
  }
  
  // Priority 2: Auto-detect build output
  const detectedPath = autoDetectBuildOutput(
    projectRoot,
    options.platform,
    projectInfo.isExpo,
    options.verbose
  );
  
  if (detectedPath) {
    return detectedPath;
  }
  
  // Priority 3: Default visible directory (fallback)
  const defaultPath = getDefaultPath(projectRoot, options.platform);
  
  return {
    detected: false,
    path: defaultPath,
    description: 'Default visible directory',
    source: DetectionSource.DEFAULT_FALLBACK,
  };
}

/**
 * Auto-detect build output based on platform
 */
function autoDetectBuildOutput(
  projectRoot: string,
  platform: Platform,
  isExpo: boolean,
  verbose?: boolean
): DetectionResult | null {
  if (verbose) {
    console.log(`Searching for ${platform} build output...`);
  }
  
  let result: DetectionResult | null = null;
  
  if (platform === 'android' as Platform) {
    result = detectAndroidBuildOutput(projectRoot, isExpo);
  } else if (platform === 'ios' as Platform) {
    result = detectIOSBuildOutput(projectRoot, isExpo);
  }
  
  if (verbose && result) {
    console.log(`✓ Detected: ${result.description}`);
    console.log(`  Path: ${result.path}`);
  } else if (verbose && !result) {
    console.log(`✗ No build output detected, using default`);
  }
  
  return result;
}

/**
 * Get default output path based on platform
 */
function getDefaultPath(projectRoot: string, platform: Platform): string {
  const relativePath =
    platform === 'android' as Platform
      ? DEFAULT_ANDROID_OUTPUT
      : DEFAULT_IOS_OUTPUT;
  
  return path.join(projectRoot, relativePath);
}

/**
 * Get platform-agnostic default output directory
 * 
 * Returns the base dota/bundles directory without platform subdirectory
 */
export function getDefaultOutputDir(projectRoot?: string): string {
  const root = projectRoot ?? process.cwd();
  return path.join(root, DEFAULT_OUTPUT_DIR);
}

/**
 * Get standardized output path for a platform
 * 
 * Returns the standard location where bundles should always end up
 */
export function getStandardizedOutputPath(
  platform: Platform,
  projectRoot?: string
): string {
  const root = projectRoot ?? process.cwd();
  const relativePath =
    platform === 'android' as Platform
      ? STANDARDIZED_ANDROID_OUTPUT
      : STANDARDIZED_IOS_OUTPUT;
  
  return path.join(root, relativePath);
}

/**
 * Format detection result as user-friendly message
 * 
 * Creates a clear message showing where bundles will be created
 */
export function formatDetectionMessage(result: DetectionResult): string {
  const emoji = result.detected ? '🔍' : '📦';
  const status = result.detected ? 'Detected' : 'Using';
  
  return `${emoji} ${status}: ${result.description}\n   Path: ${result.path}`;
}

