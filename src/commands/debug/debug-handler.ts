import { logStep, logError } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_DEBUG } from './constants';
import type { DebugOptions, DebugResult } from './types';

export async function handleDebugCommand(options: DebugOptions): Promise<DebugResult> {
  try {
    logStep(`Starting debug session for ${options.platform}...`);
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_DEBUG, platform: options.platform });
    return { success: true, message: 'Debug session started' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to start debug session: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

