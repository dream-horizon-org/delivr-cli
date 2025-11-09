/**
 * Constants for package detection
 * 
 * Defines file names and configuration for package.json detection
 */

// File name for package.json
export const PACKAGE_JSON_FILE = 'package.json';

// Encoding for reading package.json
export const PACKAGE_JSON_ENCODING = 'utf8';

// Default app name prefix (if package.json name doesn't follow conventions)
export const DEFAULT_APP_NAME_PREFIX = 'MyApp';

// Default version if not found
export const DEFAULT_VERSION = '1.0.0';

// Maximum directory depth to search for package.json
export const MAX_SEARCH_DEPTH = 5;


