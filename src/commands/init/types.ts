/**
 * Types for init command
 * 
 * Defines interfaces for initialization operations
 */

export interface InitOptions {
  /** Whether to force overwrite existing config */
  force?: boolean;
  /** Whether to run in verbose mode */
  verbose?: boolean;
  /** Whether to enable interactive prompts */
  interactive?: boolean;
}

export interface InitResult {
  /** Whether initialization was successful */
  success: boolean;
  /** Path to created config file */
  configPath?: string;
  /** Error message if failed */
  error?: string;
}

export interface InitConfig {
  /** App name */
  appName?: string;
  /** Default deployment name */
  deploymentName?: string;
  /** Server configuration */
  server?: {
    /** Server URL */
    url?: string;
  };
  /** Auth configuration */
  auth?: {
    /** Access key */
    accessKey?: string;
  };
}


