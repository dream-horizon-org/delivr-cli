/**
 * Environment variable loader
 * 
 * Loads configuration from environment variables.
 * Handles type transformations and path mapping.
 */

import { ENV_VAR_MAPPINGS } from '../constants';
import type { DelivrConfig } from '../types';

/**
 * Load configuration from environment variables
 * 
 * Reads environment variables and maps them to configuration structure
 * based on ENV_VAR_MAPPINGS.
 */
export function loadFromEnv(): Partial<DelivrConfig> {
  const config: Record<string, unknown> = {};

  for (const mapping of ENV_VAR_MAPPINGS) {
    const value = process.env[mapping.envVar];
    if (value !== undefined) {
      setConfigValue(config, mapping.configPath, value, mapping.transform);
    }
  }

  return config as Partial<DelivrConfig>;
}

/**
 * Set a nested configuration value using dot notation path
 * 
 * @param config - Configuration object to modify
 * @param path - Dot notation path (e.g., 'server.url')
 * @param value - Value to set
 * @param transform - Optional transformation function
 */
function setConfigValue(
  config: Record<string, unknown>,
  path: string,
  value: string,
  transform?: (value: string) => unknown
): void {
  const keys = path.split('.');
  
  if (keys.length === 0) {
    return; // Invalid path, nothing to set
  }
  
  let current: Record<string, unknown> = config;

  // Navigate/create nested structure
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (key === undefined) {
      return; // Should never happen with split, but guard for type safety
    }
    
    if (!current[key]) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }

  // Set the value (with optional transformation)
  const finalKey = keys[keys.length - 1];
  if (finalKey !== undefined) {
    current[finalKey] = transform ? transform(value) : value;
  }
}

