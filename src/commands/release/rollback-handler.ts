import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep, logSuccess } from '../../utils/logger';
import type { ReleaseResult } from './types';

export interface ReleaseRollbackOptions { appName: string; deploymentName: string; targetRelease?: string; serverUrl?: string; }

export async function handleReleaseRollbackCommand(options: ReleaseRollbackOptions): Promise<ReleaseResult> {
  try {
    logStep(`Rolling back release in ${options.deploymentName}...`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl ?? configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: 'rollback', appName: options.appName, deploymentName: options.deploymentName, targetRelease: options.targetRelease, serverUrl });
    logSuccess('Release rolled back successfully');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to rollback release: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

