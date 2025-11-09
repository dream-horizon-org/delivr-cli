/**
 * Configuration module for Delivr CLI
 * 
 * Main exports for the configuration system.
 */

// Type definitions
export * from './types';

// Constants
export * from './constants';

// Main loader (primary interface)
export {
  ConfigLoader,
  getConfigLoader,
  loadConfig,
  loadConfigSync,
  saveGlobalConfig,
  clearGlobalConfig,
} from './config-loader';

// Individual loaders (for advanced usage)
export {
  loadConfigFile,
  loadConfigFileSync,
  loadFromEnv,
  loadGlobalConfig,
  mergeConfigs,
  trackConfigSources,
  getDefaultConfig,
} from './loaders';
