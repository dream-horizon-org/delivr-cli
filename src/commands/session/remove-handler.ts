import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep, logSuccess } from '../../utils/logger';
import { LEGACY_COMMAND_TYPE_SESSION_REMOVE } from './constants';
import type { SessionRemoveOptions, SessionResult } from './types';

export async function handleSessionRemoveCommand(options: SessionRemoveOptions): Promise<SessionResult> {
  try {
    logStep(`Removing session: ${options.machine}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl ?? configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_SESSION_REMOVE, machine: options.machine, serverUrl });
    logSuccess(`Session removed: ${options.machine}`);
    return { success: true, message: 'Session removed successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to remove session: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

