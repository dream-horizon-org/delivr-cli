/**
 * Configuration file loader
 * 
 * Handles loading configuration from files using cosmiconfig.
 * Supports multiple file formats and automatic discovery.
 */

import { cosmiconfig, cosmiconfigSync } from 'cosmiconfig';
import * as fs from 'fs';
import * as path from 'path';
import {
  CONFIG_FILE_NAMES,
  ENV_VARS,
  LEGACY_CONFIG_FILES,
  MODULE_NAME,
} from '../constants';
import type { DelivrConfig } from '../types';

/**
 * File load result
 */
export interface FileLoadResult {
  config: DelivrConfig | null;
  filepath?: string;
  isEmpty: boolean;
}

/**
 * Load configuration from file asynchronously
 */
export async function loadConfigFile(searchFrom?: string): Promise<FileLoadResult> {
  try {
    // Check if config loading is disabled
    if (process.env[ENV_VARS.NO_CONFIG] === 'true') {
      return { config: null, isEmpty: true };
    }

    // Check for explicit config path
    const explicitPath = process.env[ENV_VARS.CONFIG_PATH];
    if (explicitPath) {
      const config = loadSpecificConfigFile(explicitPath);
      if (config) {
        return { config, filepath: explicitPath, isEmpty: false };
      }
    }

    // Use cosmiconfig to search for config files
    const explorer = cosmiconfig(MODULE_NAME, {
      searchPlaces: CONFIG_FILE_NAMES as string[], // Cast readonly to mutable for cosmiconfig
      stopDir: searchFrom ?? process.cwd(),
    });

    const result = await explorer.search(searchFrom);

    if (result && !result.isEmpty) {
      return {
        config: result.config as DelivrConfig,
        filepath: result.filepath,
        isEmpty: false,
      };
    }

    // Try legacy config files for backward compatibility
    const legacyConfig = loadLegacyConfigFile(searchFrom);
    if (legacyConfig) {
      return { config: legacyConfig, isEmpty: false };
    }

    return { config: null, isEmpty: true };
  } catch (error) {
    console.warn('Warning: Failed to load config file:', (error as Error).message);
    return { config: null, isEmpty: true };
  }
}

/**
 * Load configuration from file synchronously
 */
export function loadConfigFileSync(searchFrom?: string): FileLoadResult {
  try {
    if (process.env[ENV_VARS.NO_CONFIG] === 'true') {
      return { config: null, isEmpty: true };
    }

    const explicitPath = process.env[ENV_VARS.CONFIG_PATH];
    if (explicitPath) {
      const config = loadSpecificConfigFile(explicitPath);
      if (config) {
        return { config, filepath: explicitPath, isEmpty: false };
      }
    }

    const explorer = cosmiconfigSync(MODULE_NAME, {
      searchPlaces: CONFIG_FILE_NAMES as string[], // Cast readonly to mutable for cosmiconfig
      stopDir: searchFrom ?? process.cwd(),
    });

    const result = explorer.search(searchFrom);

    if (result && !result.isEmpty) {
      return {
        config: result.config as DelivrConfig,
        filepath: result.filepath,
        isEmpty: false,
      };
    }

    const legacyConfig = loadLegacyConfigFile(searchFrom);
    if (legacyConfig) {
      return { config: legacyConfig, isEmpty: false };
    }

    return { config: null, isEmpty: true };
  } catch (error) {
    console.warn('Warning: Failed to load config file:', (error as Error).message);
    return { config: null, isEmpty: true };
  }
}

/**
 * Load a specific config file by path
 */
function loadSpecificConfigFile(filepath: string): DelivrConfig | null {
  try {
    if (!fs.existsSync(filepath)) {
      return null;
    }

    const content = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Warning: Failed to load config from ${filepath}:`, (error as Error).message);
    return null;
  }
}

/**
 * Load legacy config files for backward compatibility
 */
function loadLegacyConfigFile(searchFrom?: string): DelivrConfig | null {
  const cwd = searchFrom ?? process.cwd();

  for (const legacyFile of LEGACY_CONFIG_FILES) {
    const legacyPath = path.join(cwd, legacyFile);
    const config = loadSpecificConfigFile(legacyPath);
    if (config) {
      // Safe cast: legacy config files have different structure than DelivrConfig
      return convertLegacyConfig(config as unknown as LegacyConfig);
    }
  }

  return null;
}

/**
 * Legacy config format from project .delivrrc files
 */
interface LegacyConfig {
  accessKey?: string;
  customServerUrl?: string;
  serverUrl?: string;
  preserveAccessKeyOnLogout?: boolean;
  [key: string]: unknown;
}

/**
 * Convert legacy config format to new format
 */
function convertLegacyConfig(legacyConfig: LegacyConfig): DelivrConfig {
  const newConfig: DelivrConfig = {};

  // Map legacy fields to new structure
  if (legacyConfig.accessKey) {
    newConfig.auth = { accessKey: legacyConfig.accessKey };
  }

  if (legacyConfig.customServerUrl ?? legacyConfig.serverUrl) {
    newConfig.server = { url: legacyConfig.customServerUrl ?? legacyConfig.serverUrl };
  }

  if (legacyConfig.preserveAccessKeyOnLogout !== undefined) {
    newConfig.auth = {
      ...newConfig.auth,
      preserveOnLogout: legacyConfig.preserveAccessKeyOnLogout,
    };
  }

  return newConfig;
}

