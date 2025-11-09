import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep, logSuccess } from '../../utils/logger';
import type { ReleaseResult } from './types';

export interface ReleaseCreateOptions { appName: string; bundlePath: string; targetBinaryVersion: string; deploymentName?: string; serverUrl?: string; description?: string; mandatory?: boolean; disabled?: boolean; rollout?: number; }

export async function handleReleaseCreateCommand(options: ReleaseCreateOptions): Promise<ReleaseResult> {
  try {
    logStep('Creating release...');
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl ?? configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: 'release', appName: options.appName, bundlePath: options.bundlePath, targetBinaryVersion: options.targetBinaryVersion, deploymentName: options.deploymentName, serverUrl, description: options.description, mandatory: options.mandatory, disabled: options.disabled, rollout: options.rollout });
    logSuccess('Release created successfully');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to create release: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

