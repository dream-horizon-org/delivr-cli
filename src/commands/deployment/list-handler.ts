import { loadConfig } from '../../config';
import { logStep, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_DEPLOYMENT_LIST, DEFAULT_FORMAT } from './constants';
import type { DeploymentListOptions, DeploymentResult } from './types';

export async function handleDeploymentListCommand(options: DeploymentListOptions): Promise<DeploymentResult> {
  try {
    logStep('Fetching deployments...');
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl || configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_DEPLOYMENT_LIST,
      appName: options.appName,
      serverUrl,
      format: options.format || DEFAULT_FORMAT,
    });
    
    return { success: true, message: 'Deployments fetched' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to fetch deployments: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

