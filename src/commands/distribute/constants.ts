/**
 * Constants for distribute command
 */

// Distribution targets
export const DISTRIBUTION_TARGET_APP_STORE = 'app-store';
export const DISTRIBUTION_TARGET_PLAY_STORE = 'play-store';
export const DISTRIBUTION_TARGET_CODEPUSH = 'codepush';
export const DISTRIBUTION_TARGET_TESTFLIGHT = 'testflight';
export const DISTRIBUTION_TARGET_FIREBASE = 'firebase';
export const DISTRIBUTION_TARGET_HOCKEY = 'hockey';
export const DISTRIBUTION_TARGET_APPCENTER = 'appcenter';

export const SUPPORTED_DISTRIBUTION_TARGETS = [
  DISTRIBUTION_TARGET_APP_STORE,
  DISTRIBUTION_TARGET_PLAY_STORE,
  DISTRIBUTION_TARGET_CODEPUSH,
  DISTRIBUTION_TARGET_TESTFLIGHT,
  DISTRIBUTION_TARGET_FIREBASE,
  DISTRIBUTION_TARGET_HOCKEY,
  DISTRIBUTION_TARGET_APPCENTER,
] as const;

// Asset types
export const ASSET_TYPE_APK = 'apk';
export const ASSET_TYPE_AAB = 'aab';
export const ASSET_TYPE_IPA = 'ipa';
export const ASSET_TYPE_BUNDLE = 'bundle';
export const ASSET_TYPE_DSYM = 'dsym';
export const ASSET_TYPE_PROGUARD = 'proguard';

export const SUPPORTED_ASSET_TYPES = [
  ASSET_TYPE_APK,
  ASSET_TYPE_AAB,
  ASSET_TYPE_IPA,
  ASSET_TYPE_BUNDLE,
  ASSET_TYPE_DSYM,
  ASSET_TYPE_PROGUARD,
] as const;

// Coming soon message
export const COMING_SOON_MESSAGE = `
🚧 This command is coming soon!

The 'distribute' command will allow you to distribute built assets to various targets:
  • App Store / Play Store (native app binaries)
  • CodePush server (JavaScript bundles)
  • TestFlight / Firebase (beta distribution)

This feature requires backend API support that is currently in development.

Current workaround:
  • For CodePush distribution: Use 'delivr release react'
  • For store distribution: Use platform-specific tools for now

Stay tuned for updates!
`;

