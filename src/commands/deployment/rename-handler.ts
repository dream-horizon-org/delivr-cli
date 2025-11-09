import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_DEPLOYMENT_RENAME } from './constants';
import type { DeploymentRenameOptions, DeploymentResult } from './types';

export async function handleDeploymentRenameCommand(options: DeploymentRenameOptions): Promise<DeploymentResult> {
  try {
    logStep(`Renaming deployment: ${options.currentName} → ${options.newName}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_DEPLOYMENT_RENAME,
      appName: options.appName,
      currentDeploymentName: options.currentName,
      newDeploymentName: options.newName,
      serverUrl,
    });
    
    logSuccess(`Deployment renamed: ${options.currentName} → ${options.newName}`);
    return { success: true, message: 'Deployment renamed successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to rename deployment: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

