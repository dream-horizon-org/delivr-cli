/**
 * Constants for bundle copying
 * 
 * Defines patterns and settings for bundle file operations
 */

// Bundle file patterns to copy
export const BUNDLE_FILE_PATTERNS: readonly string[] = [
  '*.bundle',
  '*.jsbundle',
  'index.android.bundle',
  'main.jsbundle',
];

// Asset directory names to copy
export const ASSET_DIRECTORY_NAMES: readonly string[] = [
  'assets',
  'res',
];

// Files to exclude from copying
export const EXCLUDE_PATTERNS: readonly string[] = [
  '.DS_Store',
  'Thumbs.db',
  '*.tmp',
  '*.log',
];

// Maximum file size to copy (50 MB)
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

