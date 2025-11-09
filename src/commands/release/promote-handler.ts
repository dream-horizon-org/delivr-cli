import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep, logSuccess } from '../../utils/logger';
import type { ReleaseResult } from './types';

export interface ReleasePromoteOptions { appName: string; sourceDeployment: string; destDeployment: string; serverUrl?: string; }

export async function handleReleasePromoteCommand(options: ReleasePromoteOptions): Promise<ReleaseResult> {
  try {
    logStep(`Promoting release: ${options.sourceDeployment} → ${options.destDeployment}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl ?? configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: 'promote', appName: options.appName, sourceDeployment: options.sourceDeployment, destDeployment: options.destDeployment, serverUrl });
    logSuccess('Release promoted successfully');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to promote release: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

