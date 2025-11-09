import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_DEPLOYMENT_REMOVE } from './constants';
import type { DeploymentRemoveOptions, DeploymentResult } from './types';

export async function handleDeploymentRemoveCommand(options: DeploymentRemoveOptions): Promise<DeploymentResult> {
  try {
    logStep(`Removing deployment: ${options.deploymentName}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_DEPLOYMENT_REMOVE,
      appName: options.appName,
      deploymentName: options.deploymentName,
      serverUrl,
    });
    
    logSuccess(`Deployment removed: ${options.deploymentName}`);
    return { success: true, message: 'Deployment removed successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to remove deployment: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

