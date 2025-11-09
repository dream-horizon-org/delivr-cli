/**
 * Constants for interactive prompts
 * 
 * Defines messages and configuration for user prompts
 */

// Prompt messages
export const PROMPT_APP_NAME_MESSAGE = 'What is your app name?';
export const PROMPT_APP_NAME_INITIAL = 'MyApp';

export const PROMPT_VERSION_MESSAGE = 'What is the target binary version?';
export const PROMPT_VERSION_INITIAL = '1.0.0';

// Validation messages
export const VALIDATION_ERROR_EMPTY = 'This field cannot be empty';
export const VALIDATION_ERROR_INVALID_VERSION = 'Version must follow semver format (e.g., 1.0.0)';

// Semver regex pattern (simplified)
export const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;


