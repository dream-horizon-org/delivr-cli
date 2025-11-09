import { logStep, logSuccess, logError } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_CREATE_PATCH } from './constants';
import type { PatchCreateOptions, PatchResult } from './types';

export async function handlePatchCreateCommand(options: PatchCreateOptions): Promise<PatchResult> {
  try {
    logStep('Creating patch file...');
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_CREATE_PATCH, oldFile: options.oldFile, newFile: options.newFile, outputFile: options.outputFile });
    logSuccess(`Patch created: ${options.outputFile}`);
    return { success: true, message: 'Patch created successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to create patch: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

