/**
 * Types for distribute command
 * 
 * Distribution is the process of delivering built assets (APK, IPA, or JS bundles)
 * to various targets (App Store, Play Store, CodePush server, TestFlight, etc.)
 */

/**
 * Distribution targets
 */
export type DistributionTarget = 
  | 'app-store'       // Apple App Store
  | 'play-store'      // Google Play Store
  | 'codepush'        // CodePush/DOTA server
  | 'testflight'      // Apple TestFlight
  | 'firebase'        // Firebase App Distribution
  | 'hockey'          // HockeyApp
  | 'appcenter';      // App Center

/**
 * Asset types that can be distributed
 */
export type AssetType = 
  | 'apk'             // Android APK
  | 'aab'             // Android App Bundle
  | 'ipa'             // iOS App
  | 'bundle'          // JavaScript bundle (CodePush)
  | 'dsym'            // iOS debug symbols
  | 'proguard';       // Android ProGuard mapping

/**
 * Options for distributing an asset
 */
export interface DistributeOptions {
  /** Asset to distribute (file path or build ID) */
  asset: string;
  /** Target platform(s) */
  target: DistributionTarget | DistributionTarget[];
  /** Asset type (optional, can be auto-detected) */
  assetType?: AssetType;
  /** Release notes or description */
  notes?: string;
  /** Whether this is a pre-release/beta */
  preRelease?: boolean;
  /** Testers or groups to distribute to */
  testers?: string[];
  /** Server URL */
  serverUrl?: string;
  /** Access key */
  accessKey?: string;
}

/**
 * Result of a distribution operation
 */
export interface DistributeResult {
  /** Whether distribution was successful */
  success: boolean;
  /** Target(s) where asset was distributed */
  targets?: DistributionTarget[];
  /** Distribution ID or URL */
  distributionId?: string;
  /** Error message if failed */
  error?: string;
}

/**
 * Options for listing distributions
 */
export interface DistributeListOptions {
  /** Filter by target */
  target?: DistributionTarget;
  /** Limit results */
  limit?: number;
  /** Server URL */
  serverUrl?: string;
}

/**
 * Options for getting distribution status
 */
export interface DistributeStatusOptions {
  /** Distribution ID */
  distributionId: string;
  /** Server URL */
  serverUrl?: string;
}

