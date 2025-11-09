/**
 * Package detector module
 * 
 * Exports utilities for detecting app info from package.json
 */

export {
  detectPackageInfo,
  getAppName,
  getVersion,
  formatAppName,
} from './package-detector';

export type {
  PackageInfo,
  PackageDetectionOptions,
} from './types';

export {
  PACKAGE_JSON_FILE,
  DEFAULT_VERSION,
  DEFAULT_APP_NAME_PREFIX,
} from './constants';


