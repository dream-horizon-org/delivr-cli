/**
 * Configuration merger
 * 
 * Merges multiple configuration sources with proper priority order.
 * Tracks configuration sources for debugging.
 */

import { DEFAULT_CONFIG } from '../constants';
import type { ConfigSource, DelivrConfig } from '../types';

/**
 * Merge multiple configuration objects
 * Priority: CLI > File > Global > Env > Default
 * 
 * @param configs - Array of configs in priority order (lower index = lower priority)
 * @returns Merged configuration
 */
export function mergeConfigs(...configs: Partial<DelivrConfig>[]): DelivrConfig {
  const merged: DelivrConfig = {};

  for (const config of configs) {
    deepMerge(merged as Record<string, unknown>, config as Record<string, unknown>);
  }

  return merged;
}

/**
 * Deep merge two objects
 * 
 * Recursively merges source into target, with source values taking precedence.
 * 
 * @param target - Target object to merge into
 * @param source - Source object to merge from
 */
function deepMerge(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): void {
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue)
    ) {
      if (!targetValue) {
        target[key] = {};
      }
      deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else if (sourceValue !== undefined) {
      target[key] = sourceValue;
    }
  }
}

/**
 * Track the source of each configuration value
 * 
 * Creates a map of configuration paths to their sources for debugging.
 * 
 * @param configs - Array of [source, config] tuples in priority order
 * @returns Map of config paths to their sources
 */
export function trackConfigSources(
  configs: Array<[ConfigSource, Partial<DelivrConfig>]>
): Record<string, ConfigSource> {
  const sources: Record<string, ConfigSource> = {};

  for (const [source, config] of configs) {
    trackSources(sources, source, config as Record<string, unknown>);
  }

  return sources;
}

/**
 * Track sources for a specific config object
 * 
 * @param sources - Map to store sources in
 * @param source - Source type
 * @param config - Configuration object
 * @param prefix - Current path prefix
 */
function trackSources(
  sources: Record<string, ConfigSource>,
  source: ConfigSource,
  config: Record<string, unknown>,
  prefix = ''
): void {
  for (const key in config) {
    const value = config[key];
    const path = prefix ? `${prefix}.${key}` : key;
    
    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      trackSources(sources, source, value as Record<string, unknown>, path);
    } else if (value !== undefined) {
      sources[path] = source;
    }
  }
}

/**
 * Get default configuration
 * 
 * Returns a deep clone of the default configuration.
 */
export function getDefaultConfig(): DelivrConfig {
  return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
}

