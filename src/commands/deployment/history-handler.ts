import { loadConfig } from '../../config';
import { logStep, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_DEPLOYMENT_HISTORY, DEFAULT_FORMAT } from './constants';
import type { DeploymentHistoryOptions, DeploymentResult } from './types';

export async function handleDeploymentHistoryCommand(options: DeploymentHistoryOptions): Promise<DeploymentResult> {
  try {
    logStep(`Fetching deployment history: ${options.deploymentName}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_DEPLOYMENT_HISTORY,
      appName: options.appName,
      deploymentName: options.deploymentName,
      serverUrl,
      format: options.format || DEFAULT_FORMAT,
    });
    
    return { success: true, message: 'Deployment history fetched' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to fetch deployment history: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

