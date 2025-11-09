/**
 * Types for package detection
 * 
 * Defines interfaces for package.json detection and parsing
 */

export interface PackageInfo {
  /** App name from package.json */
  name?: string;
  /** Version from package.json */
  version?: string;
  /** Whether package.json was found */
  found: boolean;
  /** Path to package.json */
  path?: string;
}

export interface PackageDetectionOptions {
  /** Starting directory (defaults to cwd) */
  projectRoot?: string;
  /** Whether to show verbose output */
  verbose?: boolean;
}


