/**
 * Types for interactive prompts
 * 
 * Defines interfaces for prompting users for missing values
 */

export interface PromptOptions {
  /** Whether to enable interactive prompts (defaults to true) */
  interactive?: boolean;
  /** Whether to show verbose output */
  verbose?: boolean;
}

export interface ReleasePromptAnswers {
  /** App name (if prompted) */
  appName?: string;
  /** Target binary version (if prompted) */
  targetBinaryVersion?: string;
}


