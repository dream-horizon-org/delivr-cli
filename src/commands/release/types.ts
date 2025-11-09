/**
 * Types for release command
 * 
 * Defines interfaces for release operations
 */

export interface ReleaseOptions {
  /** App name (auto-detected from package.json if not provided) */
  appName?: string;
  /** Platform (ios or android) */
  platform: 'ios' | 'android';
  /** Deployment name (defaults to "Staging") */
  deploymentName?: string;
  /** Target binary version (auto-detected from package.json if not provided) */
  targetBinaryVersion?: string;
  /** Output directory for bundles */
  outputDir?: string;
  /** Whether to run in verbose mode */
  verbose?: boolean;
  /** Bundle description */
  description?: string;
  /** Whether this is a mandatory update */
  mandatory?: boolean;
  /** Disabled update (for rolling back) */
  disabled?: boolean;
  /** Rollout percentage (1-100) */
  rollout?: number;
  /** Server URL */
  serverUrl?: string;
  /** Access key */
  accessKey?: string;
  /** Whether to enable interactive prompts (defaults to true) */
  interactive?: boolean;
  
  // Bundle-specific options
  /** Compression algorithm: 'deflate' (default) or 'brotli' */
  compression?: 'deflate' | 'brotli';
  /** Whether this is a patch bundle (vs full bundle) */
  isPatch?: boolean;
  /** Custom bundle name (e.g., 'main.jsbundle', 'index.android.bundle') */
  bundleName?: string;
  /** Whether to create a development bundle */
  development?: boolean;
  /** Custom entry file path (e.g., 'index.js') */
  entryFile?: string;
  /** Path where sourcemap should be written */
  sourcemapOutput?: string;
  /** Path to React Native config file */
  config?: string;
  
  // Android-specific options
  /** Path to custom Android gradle file */
  gradleFile?: string;
  
  // iOS-specific options
  /** Path to custom iOS plist file */
  plistFile?: string;
  /** Prefix for plist file */
  plistFilePrefix?: string;
  /** Path to Podfile */
  podFile?: string;
  /** Xcode project file path */
  xcodeProjectFile?: string;
  /** Xcode target name */
  xcodeTargetName?: string;
  /** Build configuration name (e.g., 'Release') */
  buildConfigurationName?: string;
  
  // Hermes options
  /** Whether to use Hermes engine and generate bytecode */
  useHermes?: boolean;
  /** Additional flags to pass to Hermes compiler */
  extraHermesFlags?: string[];
}

/**
 * Validated release options with required fields guaranteed to be present
 */
export interface ValidatedReleaseOptions extends ReleaseOptions {
  appName: string;
  targetBinaryVersion: string;
  deploymentName: string;
  outputDir: string;
}

export interface ReleaseResult {
  /** Whether release was successful */
  success: boolean;
  /** Bundle path that was created */
  bundlePath?: string;
  /** Release label/version */
  releaseLabel?: string;
  /** Error message if failed */
  error?: string;
}

export interface BundleInfo {
  /** Path to the bundle */
  path: string;
  /** Bundle size in bytes */
  size: number;
  /** Whether bundle was auto-detected or user-provided */
  detected: boolean;
  /** Description of bundle location */
  description: string;
}

