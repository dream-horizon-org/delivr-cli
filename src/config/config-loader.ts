/**
 * Main configuration loader
 * 
 * Orchestrates loading configuration from all sources with proper priority.
 * This is the primary interface for loading configuration.
 * 
 * Priority order: CLI > File > Global > Environment > Default
 */

import type { DelivrConfig, ResolvedConfig, ConfigLoadResult } from './types';
import {
  loadConfigFile,
  loadConfigFileSync,
  loadFromEnv,
  loadGlobalConfig,
  mergeConfigs,
  trackConfigSources,
  getDefaultConfig,
} from './loaders';

/**
 * Configuration loader class
 * 
 * Handles loading and merging configuration from multiple sources.
 */
export class ConfigLoader {
  private searchFrom?: string;

  constructor(options: { searchFrom?: string } = {}) {
    this.searchFrom = options.searchFrom;
  }

  /**
   * Load configuration asynchronously
   * 
   * Priority: CLI args > File > Global > Environment > Default
   * 
   * @param cliConfig - Configuration from CLI arguments
   * @returns Resolved configuration with source tracking
   */
  async load(cliConfig: Partial<DelivrConfig> = {}): Promise<ConfigLoadResult> {
    // Load from all sources
    const defaultConfig = getDefaultConfig();
    const envConfig = loadFromEnv();
    const globalConfig = loadGlobalConfig();
    const fileResult = await loadConfigFile(this.searchFrom);
    const fileConfig = fileResult.config ?? {};

    // Merge with priority order
    const mergedConfig = mergeConfigs(
      defaultConfig,
      envConfig,
      globalConfig,
      fileConfig,
      cliConfig
    );

    // Track sources for debugging
    const sources = trackConfigSources([
      ['default', defaultConfig],
      ['env', envConfig],
      ['file', globalConfig],
      ['file', fileConfig],
      ['cli', cliConfig],
    ]);

    const resolvedConfig: ResolvedConfig = {
      ...mergedConfig,
      _sources: sources,
    };

    return {
      config: resolvedConfig,
      filepath: fileResult.filepath,
      isEmpty: fileResult.isEmpty,
    };
  }

  /**
   * Load configuration synchronously
   * 
   * Priority: CLI args > File > Global > Environment > Default
   * 
   * @param cliConfig - Configuration from CLI arguments
   * @returns Resolved configuration with source tracking
   */
  loadSync(cliConfig: Partial<DelivrConfig> = {}): ConfigLoadResult {
    // Load from all sources
    const defaultConfig = getDefaultConfig();
    const envConfig = loadFromEnv();
    const globalConfig = loadGlobalConfig();
    const fileResult = loadConfigFileSync(this.searchFrom);
    const fileConfig = fileResult.config ?? {};

    // Merge with priority order
    const mergedConfig = mergeConfigs(
      defaultConfig,
      envConfig,
      globalConfig,
      fileConfig,
      cliConfig
    );

    // Track sources for debugging
    const sources = trackConfigSources([
      ['default', defaultConfig],
      ['env', envConfig],
      ['file', globalConfig],
      ['file', fileConfig],
      ['cli', cliConfig],
    ]);

    const resolvedConfig: ResolvedConfig = {
      ...mergedConfig,
      _sources: sources,
    };

    return {
      config: resolvedConfig,
      filepath: fileResult.filepath,
      isEmpty: fileResult.isEmpty,
    };
  }
}

/**
 * Singleton instance of config loader
 */
let configLoaderInstance: ConfigLoader | null = null;

/**
 * Get or create config loader instance
 */
export function getConfigLoader(options?: { searchFrom?: string }): ConfigLoader {
  if (!configLoaderInstance) {
    configLoaderInstance = new ConfigLoader(options);
  }
  return configLoaderInstance;
}

/**
 * Load configuration asynchronously
 * 
 * Convenience function that uses singleton loader.
 * 
 * @param cliConfig - Configuration from CLI arguments
 * @returns Resolved configuration
 */
export async function loadConfig(cliConfig: Partial<DelivrConfig> = {}): Promise<ConfigLoadResult> {
  const loader = getConfigLoader();
  return loader.load(cliConfig);
}

/**
 * Load configuration synchronously
 * 
 * Convenience function that uses singleton loader.
 * 
 * @param cliConfig - Configuration from CLI arguments
 * @returns Resolved configuration
 */
export function loadConfigSync(cliConfig: Partial<DelivrConfig> = {}): ConfigLoadResult {
  const loader = getConfigLoader();
  return loader.loadSync(cliConfig);
}

// Re-export global config functions for convenience
export { saveGlobalConfig, clearGlobalConfig } from './loaders';
