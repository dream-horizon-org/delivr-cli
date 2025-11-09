/**
 * Package detector utility
 * 
 * Auto-detects app name and version from package.json
 * Searches current directory and parent directories
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  MAX_SEARCH_DEPTH,
  PACKAGE_JSON_ENCODING,
  PACKAGE_JSON_FILE,
} from './constants';
import type { PackageDetectionOptions, PackageInfo } from './types';

/**
 * Detect package.json and extract app info
 * 
 * Searches for package.json starting from projectRoot (or cwd)
 * and moving up the directory tree
 */
export function detectPackageInfo(
  options: PackageDetectionOptions = {}
): PackageInfo {
  const projectRoot = options.projectRoot ?? process.cwd();
  const verbose = options.verbose ?? false;

  if (verbose) {
    console.log(`\nSearching for package.json starting from: ${projectRoot}`);
  }

  // Search for package.json
  const packageJsonPath = findPackageJson(projectRoot, verbose);

  if (!packageJsonPath) {
    if (verbose) {
      console.log('No package.json found');
    }
    return {
      found: false,
    };
  }

  // Read and parse package.json
  try {
    const packageJsonContent = fs.readFileSync(
      packageJsonPath,
      PACKAGE_JSON_ENCODING
    );
    const packageJson = JSON.parse(packageJsonContent);

    const packageInfo: PackageInfo = {
      found: true,
      path: packageJsonPath,
      name: packageJson.name,
      version: packageJson.version,
    };

    if (verbose) {
      console.log(`Found package.json at: ${packageJsonPath}`);
      console.log(`  Name: ${packageInfo.name ?? '(not set)'}`);
      console.log(`  Version: ${packageInfo.version ?? '(not set)'}`);
    }

    return packageInfo;
  } catch (error) {
    if (verbose) {
      console.log(
        `Error reading package.json: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }
    return {
      found: false,
    };
  }
}

/**
 * Find package.json by searching up the directory tree
 * 
 * Starts from startDir and searches parent directories
 * up to MAX_SEARCH_DEPTH levels
 */
function findPackageJson(
  startDir: string,
  verbose: boolean = false
): string | null {
  let currentDir = path.resolve(startDir);
  let depth = 0;

  while (depth < MAX_SEARCH_DEPTH) {
    const packageJsonPath = path.join(currentDir, PACKAGE_JSON_FILE);

    if (verbose) {
      console.log(`  Checking: ${packageJsonPath}`);
    }

    if (fs.existsSync(packageJsonPath)) {
      return packageJsonPath;
    }

    // Move to parent directory
    const parentDir = path.dirname(currentDir);

    // Stop if we've reached the root
    if (parentDir === currentDir) {
      break;
    }

    currentDir = parentDir;
    depth++;
  }

  return null;
}

/**
 * Get app name from package info
 * 
 * Returns the name from package.json, or undefined if not found
 */
export function getAppName(packageInfo: PackageInfo): string | undefined {
  return packageInfo.found ? packageInfo.name : undefined;
}

/**
 * Get version from package info
 * 
 * Returns the version from package.json, or undefined if not found
 */
export function getVersion(packageInfo: PackageInfo): string | undefined {
  return packageInfo.found ? packageInfo.version : undefined;
}

/**
 * Format app name for display
 * 
 * Converts package.json name to a display-friendly format
 * e.g., "@my-org/my-app" -> "my-app"
 */
export function formatAppName(name: string): string {
  // Remove scope if present (e.g., @my-org/my-app -> my-app)
  const withoutScope = name.replace(/^@[^/]+\//, '');
  
  // Convert kebab-case to PascalCase for display
  // e.g., my-app -> MyApp
  return withoutScope
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}


