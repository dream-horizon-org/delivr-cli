/**
 * Global configuration manager
 * 
 * Manages global configuration stored in user's home directory.
 * Handles reading, writing, and clearing global config.
 */

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  GLOBAL_CONFIG_DIR,
  GLOBAL_CONFIG_FILE,
  LEGACY_GLOBAL_CONFIG_FILE,
} from '../constants';
import type { DelivrConfig } from '../types';

/**
 * Load global configuration from user's home directory
 */
export function loadGlobalConfig(): Partial<DelivrConfig> {
  try {
    const homeDir = os.homedir();
    const globalConfigPath = path.join(homeDir, GLOBAL_CONFIG_DIR, GLOBAL_CONFIG_FILE);

    if (fs.existsSync(globalConfigPath)) {
      const content = fs.readFileSync(globalConfigPath, 'utf8');
      return JSON.parse(content);
    }

    // Try legacy global config
    const legacyGlobalPath = path.join(homeDir, LEGACY_GLOBAL_CONFIG_FILE);
    if (fs.existsSync(legacyGlobalPath)) {
      const content = fs.readFileSync(legacyGlobalPath, 'utf8');
      const parsed = JSON.parse(content);
      return convertLegacyGlobalConfig(parsed);
    }

    return {};
  } catch (error) {
    console.warn('Warning: Failed to load global config:', (error as Error).message);
    return {};
  }
}

/**
 * Save global configuration to user's home directory
 */
export function saveGlobalConfig(config: Partial<DelivrConfig>): void {
  try {
    const homeDir = os.homedir();
    const globalConfigDir = path.join(homeDir, GLOBAL_CONFIG_DIR);
    const globalConfigPath = path.join(globalConfigDir, GLOBAL_CONFIG_FILE);

    // Create directory if it doesn't exist
    if (!fs.existsSync(globalConfigDir)) {
      fs.mkdirSync(globalConfigDir, { recursive: true });
    }

    // Write config
    fs.writeFileSync(globalConfigPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Failed to save global config: ${(error as Error).message}`);
  }
}

/**
 * Clear global configuration
 */
export function clearGlobalConfig(): void {
  try {
    const homeDir = os.homedir();
    const globalConfigPath = path.join(homeDir, GLOBAL_CONFIG_DIR, GLOBAL_CONFIG_FILE);

    if (fs.existsSync(globalConfigPath)) {
      fs.unlinkSync(globalConfigPath);
    }
  } catch (error) {
    throw new Error(`Failed to clear global config: ${(error as Error).message}`);
  }
}

/**
 * Legacy global config format from ~/.dota.config
 */
interface LegacyGlobalConfig {
  accessKey?: string;
  customServerUrl?: string;
  serverUrl?: string;
  [key: string]: unknown;
}

/**
 * Convert legacy global config format to new format
 */
function convertLegacyGlobalConfig(legacyConfig: LegacyGlobalConfig): DelivrConfig {
  const newConfig: DelivrConfig = {};

  if (legacyConfig.accessKey) {
    newConfig.auth = { accessKey: legacyConfig.accessKey };
  }

  if (legacyConfig.customServerUrl ?? legacyConfig.serverUrl) {
    newConfig.server = { url: legacyConfig.customServerUrl ?? legacyConfig.serverUrl };
  }

  return newConfig;
}

