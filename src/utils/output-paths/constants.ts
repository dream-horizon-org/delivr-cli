/**
 * Constants for output path detection
 * 
 * Defines default paths, search patterns for Android/iOS builds,
 * and Expo-specific detection patterns
 */

// Default output directories (visible, not hidden!)
// NOTE: Using 'dota' without dot prefix to make folders visible
export const DEFAULT_OUTPUT_DIR = './dota/bundles';
export const DEFAULT_ANDROID_OUTPUT = './dota/bundles/android';
export const DEFAULT_IOS_OUTPUT = './dota/bundles/ios';

// Standardized output directories (always copy bundles here)
// NOTE: Using 'dota' without dot prefix to make folders visible
export const STANDARDIZED_OUTPUT_DIR = './dota/bundles';
export const STANDARDIZED_ANDROID_OUTPUT = './dota/bundles/android';
export const STANDARDIZED_IOS_OUTPUT = './dota/bundles/ios';

// Android build output paths (non-Expo)
export const ANDROID_BUILD_PATHS: readonly string[] = [
  'android/app/build/generated/assets/react/release',
  'android/app/build/generated/assets/react/debug',
  'android/app/build/intermediates/assets/release',
  'android/app/build/intermediates/assets/debug',
  'android/app/build/generated/res/react/release',
  'android/app/build/generated/res/react/debug',
];

// Android build variants to check
export const ANDROID_VARIANTS: readonly string[] = [
  'release',
  'debug',
  'staging',
];

// iOS build output paths (non-Expo)
export const IOS_BUILD_PATHS: readonly string[] = [
  'ios/build/Build/Products/Release-iphonesimulator',
  'ios/build/Build/Products/Debug-iphonesimulator',
  'ios/build/Build/Products/Release-iphoneos',
  'ios/build/Build/Products/Debug-iphoneos',
  'ios/build',
];

// Expo-specific paths
export const EXPO_ANDROID_PATHS: readonly string[] = [
  '.expo/android/app/build/generated/assets/react/release',
  '.expo/android/app/build/generated/assets/react/debug',
];

export const EXPO_IOS_PATHS: readonly string[] = [
  '.expo/ios/build',
];

// Project detection patterns
export const EXPO_CONFIG_FILES: readonly string[] = [
  'app.json',
  'app.config.js',
  'app.config.ts',
];

export const REACT_NATIVE_CONFIG_FILES: readonly string[] = [
  'react-native.config.js',
  'metro.config.js',
];

// Maximum age of build directory to consider (in milliseconds)
// Build directories older than this are likely stale
export const MAX_BUILD_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

// Package.json detection
export const PACKAGE_JSON_FILE = 'package.json';
export const PACKAGE_JSON_ENCODING = 'utf8';

// Dependency names
export const EXPO_DEPENDENCY_NAMES: readonly string[] = ['expo', 'expo-cli'];
export const REACT_NATIVE_DEPENDENCY_NAME = 'react-native';
export const PACKAGE_JSON_DEP_KEYS: readonly string[] = [
  'dependencies',
  'devDependencies',
];

