/**
 * Interactive prompts utility
 * 
 * Provides interactive prompts for missing release options
 * Uses prompts library for a clean, modern CLI experience
 */

import prompts from 'prompts';
import type { PromptOptions, ReleasePromptAnswers } from './types';
import {
  PROMPT_APP_NAME_MESSAGE,
  PROMPT_APP_NAME_INITIAL,
  PROMPT_VERSION_MESSAGE,
  PROMPT_VERSION_INITIAL,
  VALIDATION_ERROR_EMPTY,
  VALIDATION_ERROR_INVALID_VERSION,
  SEMVER_REGEX,
} from './constants';

/**
 * Prompt for missing release information
 * 
 * Only prompts for values that are undefined
 * Returns the prompted values or empty object if interactive is false
 */
export async function promptForReleaseInfo(
  currentAppName: string | undefined,
  currentVersion: string | undefined,
  options: PromptOptions = {}
): Promise<ReleasePromptAnswers> {
  const interactive = options.interactive !== false; // Default to true
  
  // If not interactive or all values present, return empty
  if (!interactive || (currentAppName && currentVersion)) {
    return {};
  }
  
  const questions: prompts.PromptObject[] = [];
  
  // Prompt for app name if missing
  if (!currentAppName) {
    questions.push({
      type: 'text',
      name: 'appName',
      message: PROMPT_APP_NAME_MESSAGE,
      initial: PROMPT_APP_NAME_INITIAL,
      validate: (value: string) => {
        if (!value || value.trim() === '') {
          return VALIDATION_ERROR_EMPTY;
        }
        return true;
      },
    });
  }
  
  // Prompt for version if missing
  if (!currentVersion) {
    questions.push({
      type: 'text',
      name: 'targetBinaryVersion',
      message: PROMPT_VERSION_MESSAGE,
      initial: PROMPT_VERSION_INITIAL,
      validate: (value: string) => {
        if (!value || value.trim() === '') {
          return VALIDATION_ERROR_EMPTY;
        }
        if (!SEMVER_REGEX.test(value)) {
          return VALIDATION_ERROR_INVALID_VERSION;
        }
        return true;
      },
    });
  }
  
  // No questions to ask
  if (questions.length === 0) {
    return {};
  }
  
  // Show interactive prompts
  const answers = await prompts(questions, {
    onCancel: () => {
      console.log('\n❌ Operation cancelled by user');
      process.exit(0);
    },
  });
  
  return answers;
}

/**
 * Check if prompts are supported in current environment
 * 
 * Prompts don't work in non-TTY environments (like CI/CD)
 */
export function isInteractiveSupported(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}


