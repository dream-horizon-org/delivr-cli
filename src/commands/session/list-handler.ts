import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep } from '../../utils/logger';
import { DEFAULT_FORMAT, LEGACY_COMMAND_TYPE_SESSION_LIST } from './constants';
import type { SessionListOptions, SessionResult } from './types';

export async function handleSessionListCommand(options: SessionListOptions): Promise<SessionResult> {
  try {
    logStep('Fetching sessions...');
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl ?? configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_SESSION_LIST, serverUrl, format: options.format ?? DEFAULT_FORMAT });
    return { success: true, message: 'Sessions fetched' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to fetch sessions: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

