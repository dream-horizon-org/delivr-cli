import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_DEPLOYMENT_CLEAR } from './constants';
import type { DeploymentClearOptions, DeploymentResult } from './types';

export async function handleDeploymentClearCommand(options: DeploymentClearOptions): Promise<DeploymentResult> {
  try {
    logStep(`Clearing deployment history: ${options.deploymentName}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_DEPLOYMENT_CLEAR,
      appName: options.appName,
      deploymentName: options.deploymentName,
      serverUrl,
    });
    
    logSuccess(`Deployment history cleared: ${options.deploymentName}`);
    return { success: true, message: 'Deployment history cleared successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to clear deployment history: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

