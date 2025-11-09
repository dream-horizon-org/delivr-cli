import { logStep, logSuccess, logError } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_APPLY_PATCH } from './constants';
import type { PatchApplyOptions, PatchResult } from './types';

export async function handlePatchApplyCommand(options: PatchApplyOptions): Promise<PatchResult> {
  try {
    logStep('Applying patch...');
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_APPLY_PATCH, oldFile: options.oldFile, patchFile: options.patchFile, outputFile: options.outputFile });
    logSuccess(`Patch applied: ${options.outputFile}`);
    return { success: true, message: 'Patch applied successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to apply patch: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

