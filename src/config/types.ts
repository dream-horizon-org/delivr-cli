/**
 * Configuration types for Delivr CLI
 * 
 * This defines the type-safe configuration structure for the CLI.
 * Configuration can be provided via:
 * 1. Command line (highest priority)
 * 2. Config file (.delivrrc, delivr.config.json, etc.)
 * 3. Environment variables (lowest priority)
 */

/**
 * Main configuration interface
 */
export interface DelivrConfig {
  /**
   * Server configuration
   */
  server?: ServerConfig;

  /**
   * Authentication configuration
   */
  auth?: AuthConfig;

  /**
   * Default project settings
   */
  defaults?: DefaultsConfig;

  /**
   * Release configuration
   */
  release?: ReleaseConfig;

  /**
   * Build configuration
   */
  build?: BuildConfig;

  /**
   * Distribution configuration
   */
  distribution?: DistributionConfig;
}

/**
 * Server configuration
 */
export interface ServerConfig {
  /**
   * Server URL (e.g., https://api.delivr.com)
   * Can be overridden by DELIVR_SERVER_URL env var
   */
  url?: string;

  /**
   * API endpoint (default: /api/v1)
   */
  apiEndpoint?: string;

  /**
   * Request timeout in milliseconds (default: 30000)
   */
  timeout?: number;
}

/**
 * Authentication configuration
 */
export interface AuthConfig {
  /**
   * Access key for authentication
   * Can be overridden by DELIVR_ACCESS_KEY env var
   */
  accessKey?: string;

  /**
   * Whether to preserve access key on logout
   */
  preserveOnLogout?: boolean;
}

/**
 * Default settings for commands
 */
export interface DefaultsConfig {
  /**
   * Default project name
   */
  project?: string;

  /**
   * Default deployment name (e.g., Staging, Production)
   */
  deploymentName?: string;

  /**
   * Default release type (scheduled, hotfix, codepush)
   */
  releaseType?: 'scheduled' | 'hotfix' | 'codepush';

  /**
   * Default platforms (ios, android, or both)
   */
  platforms?: ('ios' | 'android')[];
}

/**
 * Release configuration
 */
export interface ReleaseConfig {
  /**
   * Release types configuration
   */
  types?: {
    scheduled?: ReleaseTypeConfig;
    hotfix?: ReleaseTypeConfig;
    codepush?: CodePushConfig;
  };
}

/**
 * Release type configuration
 */
export interface ReleaseTypeConfig {
  /**
   * Platforms for this release type
   */
  platforms?: ('ios' | 'android')[];

  /**
   * Build requirements
   */
  buildRequirements?: {
    ios?: {
      scheme?: string;
      workspace?: string;
      configuration?: string;
    };
    android?: {
      variant?: string;
      gradle?: string;
      flavor?: string;
    };
  };

  /**
   * Approval requirements
   */
  approvals?: {
    required?: string[];
    autoApprove?: boolean;
    fastTrack?: boolean;
  };

  /**
   * Distribution configuration
   */
  distribution?: {
    ios?: {
      store?: string;
      track?: string;
      screenshotsRequired?: boolean;
      metadataRequired?: boolean;
    };
    android?: {
      store?: string;
      track?: string;
      screenshotsRequired?: boolean;
      storeListingRequired?: boolean;
    };
  };
}

/**
 * CodePush-specific configuration
 */
export interface CodePushConfig {
  /**
   * Deployment keys for different environments
   */
  deploymentKeys?: {
    production?: string;
    staging?: string;
    [key: string]: string | undefined;
  };

  /**
   * Rollout strategy configuration
   */
  rollout?: {
    strategy?: 'gradual' | 'immediate';
    initialPercentage?: number;
  };

  /**
   * Target version for CodePush updates
   */
  targetVersion?: string;

  /**
   * Whether updates are mandatory
   */
  mandatory?: boolean;
}

/**
 * Build configuration
 */
export interface BuildConfig {
  /**
   * iOS build configuration
   */
  ios?: {
    scheme?: string;
    workspace?: string;
    configuration?: string;
    exportMethod?: 'app-store' | 'ad-hoc' | 'enterprise' | 'development';
  };

  /**
   * Android build configuration
   */
  android?: {
    variant?: string;
    gradle?: string;
    flavor?: string;
    buildType?: 'debug' | 'release';
  };

  /**
   * Build environment variables
   */
  env?: Record<string, string>;
}

/**
 * Distribution configuration
 */
export interface DistributionConfig {
  /**
   * iOS distribution configuration
   */
  ios?: {
    store?: {
      apiKey?: string;
      apiIssuer?: string;
      apiKeyPath?: string;
    };
  };

  /**
   * Android distribution configuration
   */
  android?: {
    store?: {
      serviceAccount?: string;
      serviceAccountPath?: string;
    };
  };
}

/**
 * Resolved configuration (after merging all sources)
 */
export interface ResolvedConfig extends DelivrConfig {
  /**
   * Source of each configuration value
   */
  _sources?: Record<string, ConfigSource>;
}

/**
 * Configuration source type
 */
export type ConfigSource = 'env' | 'file' | 'cli' | 'default';

/**
 * Configuration load result
 */
export interface ConfigLoadResult {
  /**
   * Loaded configuration
   */
  config: ResolvedConfig;

  /**
   * Path to configuration file (if loaded from file)
   */
  filepath?: string;

  /**
   * Whether configuration file was found
   */
  isEmpty: boolean;
}

/**
 * Environment variable mapping
 */
export interface EnvVarMapping {
  /**
   * Environment variable name
   */
  envVar: string;

  /**
   * Configuration key path (e.g., 'server.url')
   */
  configPath: string;

  /**
   * Optional transformation function
   * Returns unknown to allow flexible transformations while maintaining type safety
   */
  transform?: (value: string) => unknown;
}

