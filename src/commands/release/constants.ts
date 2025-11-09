/**
 * Constants for release command
 * 
 * Defines default values and configuration for releases
 */

// Default deployment name (matches existing CLI behavior)
export const DEFAULT_DEPLOYMENT_NAME = 'Staging';

// Default rollout percentage
export const DEFAULT_ROLLOUT_PERCENTAGE = 100;

// Bundle file naming patterns
export const BUNDLE_FILE_PATTERNS = {
  ANDROID: 'index.android.bundle',
  IOS: 'main.jsbundle',
} as const;

// Asset directory names
export const ASSET_DIR_NAMES = {
  ANDROID: 'assets',
  IOS: 'assets',
} as const;

// Server defaults (will be overridden by config system)
export const DEFAULT_SERVER_URL = 'http://localhost:3000';

// Release validation
export const MAX_BUNDLE_SIZE_MB = 50;
export const MIN_BUNDLE_SIZE_BYTES = 100;

// Supported platforms
export const SUPPORTED_PLATFORMS: readonly string[] = ['ios', 'android'];

// Legacy command types (for adapter)
export const LEGACY_COMMAND_TYPE_RELEASE_REACT = 'release-react';

// Default version for testing/fallback
export const DEFAULT_TARGET_BINARY_VERSION = '1.0.0';

// Placeholder release label (in adapter simulation)
export const PLACEHOLDER_RELEASE_LABEL = 'v1';

// Compression algorithms
export const COMPRESSION_DEFLATE = 'deflate';
export const COMPRESSION_BROTLI = 'brotli';
export const DEFAULT_COMPRESSION = COMPRESSION_DEFLATE;
export const SUPPORTED_COMPRESSIONS: readonly string[] = [COMPRESSION_DEFLATE, COMPRESSION_BROTLI];

// Bundle types
export const BUNDLE_TYPE_FULL = 'full';
export const BUNDLE_TYPE_PATCH = 'patch';

// Default bundle names by platform
export const DEFAULT_BUNDLE_NAMES = {
  ios: 'main.jsbundle',
  android: 'index.android.bundle',
  windows: 'index.windows.bundle',
} as const;

// Default entry files
export const DEFAULT_ENTRY_FILE = 'index.js';

// Build configurations
export const DEFAULT_BUILD_CONFIGURATION = 'Release';

