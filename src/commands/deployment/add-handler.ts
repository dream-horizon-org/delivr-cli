import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_DEPLOYMENT_ADD } from './constants';
import type { DeploymentAddOptions, DeploymentResult } from './types';

export async function handleDeploymentAddCommand(options: DeploymentAddOptions): Promise<DeploymentResult> {
  try {
    logStep(`Creating deployment: ${options.deploymentName}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_DEPLOYMENT_ADD,
      appName: options.appName,
      deploymentName: options.deploymentName,
      serverUrl,
    });
    
    logSuccess(`Deployment created: ${options.deploymentName}`);
    return { success: true, message: 'Deployment created successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to create deployment: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

