import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_COLLABORATOR_ADD } from './constants';
import type { CollaboratorAddOptions, CollaboratorResult } from './types';

export async function handleCollaboratorAddCommand(options: CollaboratorAddOptions): Promise<CollaboratorResult> {
  try {
    logStep(`Adding collaborator: ${options.email}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_COLLABORATOR_ADD, appName: options.appName, email: options.email, serverUrl });
    logSuccess(`Collaborator added: ${options.email}`);
    return { success: true, message: 'Collaborator added successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to add collaborator: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

