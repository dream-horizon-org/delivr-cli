/**
 * Types for output path detection and resolution
 * 
 * Supports:
 * - Android (Expo & non-Expo)
 * - iOS (Expo & non-Expo)
 * - Auto-detection of build outputs
 * - Fallback to visible default directories
 */

export interface DetectionResult {
  /** Whether a build output was detected */
  detected: boolean;
  /** The detected or default path */
  path: string;
  /** Description of what was detected */
  description: string;
  /** Detection source */
  source: DetectionSource;
}

export enum DetectionSource {
  /** Detected from Android build output */
  ANDROID_BUILD = 'android_build',
  /** Detected from iOS build output */
  IOS_BUILD = 'ios_build',
  /** Detected from Expo build */
  EXPO_BUILD = 'expo_build',
  /** User provided via CLI */
  USER_PROVIDED = 'user_provided',
  /** Fell back to default visible directory */
  DEFAULT_FALLBACK = 'default_fallback',
}

export enum Platform {
  IOS = 'ios',
  ANDROID = 'android',
}

export interface ProjectInfo {
  /** Whether project uses Expo */
  isExpo: boolean;
  /** Project root directory */
  projectRoot: string;
  /** React Native version (if detectable) */
  reactNativeVersion?: string;
}

export interface PathResolverOptions {
  /** User-provided output directory (highest priority) */
  userOutputDir?: string;
  /** Platform to build for */
  platform: Platform;
  /** Project root directory */
  projectRoot?: string;
  /** Whether to use verbose logging */
  verbose?: boolean;
}

