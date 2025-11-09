/**
 * Prompts module
 * 
 * Exports utilities for interactive user prompts
 */

export { promptForReleaseInfo, isInteractiveSupported } from './prompt-utils';

export type { PromptOptions, ReleasePromptAnswers } from './types';

export {
  PROMPT_APP_NAME_MESSAGE,
  PROMPT_VERSION_MESSAGE,
} from './constants';


