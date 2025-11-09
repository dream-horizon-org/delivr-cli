/**
 * Expo project detection utility
 * 
 * Detects whether a React Native project uses Expo
 */

import * as fs from 'fs';
import * as path from 'path';
import {
    EXPO_CONFIG_FILES,
    EXPO_DEPENDENCY_NAMES,
    PACKAGE_JSON_DEP_KEYS,
    PACKAGE_JSON_ENCODING,
    PACKAGE_JSON_FILE,
    REACT_NATIVE_DEPENDENCY_NAME,
} from './constants';
import type { ProjectInfo } from './types';

/**
 * Detect if project uses Expo
 * 
 * Checks for Expo config files (app.json, app.config.js, app.config.ts)
 * and Expo dependencies in package.json
 */
export function detectExpo(projectRoot: string): ProjectInfo {
  const isExpo = hasExpoConfig(projectRoot) || hasExpoDependency(projectRoot);
  
  return {
    isExpo,
    projectRoot,
    reactNativeVersion: getReactNativeVersion(projectRoot),
  };
}

/**
 * Check if any Expo config file exists
 */
function hasExpoConfig(projectRoot: string): boolean {
  return EXPO_CONFIG_FILES.some((configFile) => {
    const configPath = path.join(projectRoot, configFile);
    return fs.existsSync(configPath);
  });
}

/**
 * Check if package.json has Expo dependencies
 */
function hasExpoDependency(projectRoot: string): boolean {
  const packageJsonPath = path.join(projectRoot, PACKAGE_JSON_FILE);
  
  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }
  
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, PACKAGE_JSON_ENCODING)
    );
    
    // Safely access dependency keys
    const depKey = PACKAGE_JSON_DEP_KEYS[0];
    const devDepKey = PACKAGE_JSON_DEP_KEYS[1];
    
    if (depKey === undefined || devDepKey === undefined) {
      return false; // Constants array is malformed
    }
    
    const dependencies = {
      ...packageJson[depKey],
      ...packageJson[devDepKey],
    };
    
    return EXPO_DEPENDENCY_NAMES.some((depName) => Boolean(dependencies[depName]));
  } catch (error) {
    return false;
  }
}

/**
 * Get React Native version from package.json
 */
function getReactNativeVersion(projectRoot: string): string | undefined {
  const packageJsonPath = path.join(projectRoot, PACKAGE_JSON_FILE);
  
  if (!fs.existsSync(packageJsonPath)) {
    return undefined;
  }
  
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, PACKAGE_JSON_ENCODING)
    );
    
    // Safely access dependency keys
    const depKey = PACKAGE_JSON_DEP_KEYS[0];
    const devDepKey = PACKAGE_JSON_DEP_KEYS[1];
    
    if (depKey === undefined || devDepKey === undefined) {
      return undefined; // Constants array is malformed
    }
    
    const dependencies = {
      ...packageJson[depKey],
      ...packageJson[devDepKey],
    };
    
    return dependencies[REACT_NATIVE_DEPENDENCY_NAME];
  } catch (error) {
    return undefined;
  }
}

