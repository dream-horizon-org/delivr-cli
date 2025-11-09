/**
 * Types for bundle copying operations
 * 
 * Handles copying bundles from detected/source locations to standardized locations
 */

export interface BundleCopyOptions {
  /** Source path (where bundle was detected/created) */
  sourcePath: string;
  /** Target path (standardized location) */
  targetPath: string;
  /** Whether to show verbose output */
  verbose?: boolean;
}

export interface BundleCopyResult {
  /** Whether copy was successful */
  success: boolean;
  /** Source path that was copied from */
  sourcePath: string;
  /** Target path that was copied to */
  targetPath: string;
  /** Number of files copied */
  filesCopied?: number;
  /** Total size of copied files in bytes */
  totalSize?: number;
  /** Error message if failed */
  error?: string;
}

