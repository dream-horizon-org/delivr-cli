import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_COLLABORATOR_REMOVE } from './constants';
import type { CollaboratorRemoveOptions, CollaboratorResult } from './types';

export async function handleCollaboratorRemoveCommand(options: CollaboratorRemoveOptions): Promise<CollaboratorResult> {
  try {
    logStep(`Removing collaborator: ${options.email}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_COLLABORATOR_REMOVE, appName: options.appName, email: options.email, serverUrl });
    logSuccess(`Collaborator removed: ${options.email}`);
    return { success: true, message: 'Collaborator removed successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to remove collaborator: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

