/**
 * Configuration constants for Delivr CLI
 * 
 * Defines configuration file names, environment variable names,
 * and default values.
 */

import type { EnvVarMapping } from './types';

/**
 * CLI module name (used by cosmiconfig)
 */
export const MODULE_NAME = 'delivr';

/**
 * Legacy module name (for backward compatibility)
 */
export const LEGACY_MODULE_NAME = 'codepush';

/**
 * Configuration file names (cosmiconfig will search for these)
 * Priority order (first found wins):
 * 1. .delivrrc
 * 2. .delivrrc.json
 * 3. .delivrrc.yaml / .delivrrc.yml
 * 4. .delivrrc.js
 * 5. delivr.config.js
 * 6. package.json (delivr key)
 */
export const CONFIG_FILE_NAMES: readonly string[] = [
  '.delivrrc',
  '.delivrrc.json',
  '.delivrrc.yaml',
  '.delivrrc.yml',
  '.delivrrc.js',
  'delivr.config.js',
  'delivr.config.json',
];

/**
 * Legacy config file names (for backward compatibility)
 */
export const LEGACY_CONFIG_FILES: readonly string[] = [
  '.codepush',
  '.codepush.config',
  '.code-push.config',
  '.dota.config',
];

/**
 * Environment variable prefix
 */
export const ENV_PREFIX = 'DELIVR_';

/**
 * Legacy environment variable prefix (for backward compatibility)
 */
export const LEGACY_ENV_PREFIX = 'CODE_PUSH_';

/**
 * Environment variable names
 */
export const ENV_VARS = {
  /** Server URL (e.g., https://api.delivr.com) */
  SERVER_URL: 'DELIVR_SERVER_URL',
  
  /** Access key for authentication */
  ACCESS_KEY: 'DELIVR_ACCESS_KEY',
  
  /** Default project name */
  PROJECT: 'DELIVR_PROJECT',
  
  /** Default deployment name */
  DEPLOYMENT_NAME: 'DELIVR_DEPLOYMENT_NAME',
  
  /** API endpoint */
  API_ENDPOINT: 'DELIVR_API_ENDPOINT',
  
  /** Request timeout in milliseconds */
  TIMEOUT: 'DELIVR_TIMEOUT',
  
  /** Config file path (to override default search) */
  CONFIG_PATH: 'DELIVR_CONFIG_PATH',
  
  /** Disable config file loading */
  NO_CONFIG: 'DELIVR_NO_CONFIG',
} as const;

/**
 * Legacy environment variable names (for backward compatibility)
 */
export const LEGACY_ENV_VARS = {
  SERVER_URL: 'CODE_PUSH_SERVER_URL',
  ACCESS_KEY: 'CODE_PUSH_ACCESS_KEY',
} as const;

/**
 * Environment variable to configuration path mapping
 * This defines how environment variables map to configuration keys
 */
export const ENV_VAR_MAPPINGS: readonly EnvVarMapping[] = [
  {
    envVar: ENV_VARS.SERVER_URL,
    configPath: 'server.url',
  },
  {
    envVar: ENV_VARS.ACCESS_KEY,
    configPath: 'auth.accessKey',
  },
  {
    envVar: ENV_VARS.PROJECT,
    configPath: 'defaults.project',
  },
  {
    envVar: ENV_VARS.DEPLOYMENT_NAME,
    configPath: 'defaults.deploymentName',
  },
  {
    envVar: ENV_VARS.API_ENDPOINT,
    configPath: 'server.apiEndpoint',
  },
  {
    envVar: ENV_VARS.TIMEOUT,
    configPath: 'server.timeout',
    transform: (value: string) => parseInt(value, 10),
  },
  // Legacy environment variables (for backward compatibility)
  {
    envVar: LEGACY_ENV_VARS.SERVER_URL,
    configPath: 'server.url',
  },
  {
    envVar: LEGACY_ENV_VARS.ACCESS_KEY,
    configPath: 'auth.accessKey',
  },
];

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG = {
  server: {
    url: 'http://localhost:3000',
    apiEndpoint: '/api/v1',
    timeout: 30000,
  },
  defaults: {
    deploymentName: 'Staging',
  },
} as const;

/**
 * Configuration priority order
 * (higher number = higher priority)
 */
export const CONFIG_PRIORITY = {
  DEFAULT: 0,
  ENV: 1,
  FILE: 2,
  CLI: 3,
} as const;

/**
 * Global config directory location
 * Used for storing user-level configuration (like access keys)
 */
export const GLOBAL_CONFIG_DIR = '.delivr';

/**
 * Global config file name (stored in user's home directory)
 */
export const GLOBAL_CONFIG_FILE = 'config.json';

/**
 * Legacy global config file (for backward compatibility)
 */
export const LEGACY_GLOBAL_CONFIG_FILE = '.dota.config';

/**
 * Session config file name (stores login session)
 */
export const SESSION_CONFIG_FILE = 'session.json';

/**
 * Legacy session config file (for backward compatibility)
 */
export const LEGACY_SESSION_CONFIG_FILE = '.code-push.config';

