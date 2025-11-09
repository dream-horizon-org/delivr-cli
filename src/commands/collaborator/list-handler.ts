import { loadConfig } from '../../config';
import { logStep, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_COLLABORATOR_LIST, DEFAULT_FORMAT } from './constants';
import type { CollaboratorListOptions, CollaboratorResult } from './types';

export async function handleCollaboratorListCommand(options: CollaboratorListOptions): Promise<CollaboratorResult> {
  try {
    logStep('Fetching collaborators...');
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_COLLABORATOR_LIST, appName: options.appName, serverUrl, format: options.format || DEFAULT_FORMAT });
    return { success: true, message: 'Collaborators fetched' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to fetch collaborators: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

