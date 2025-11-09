import { loadConfig } from '../../config';
import { logStep, logSuccess, logError } from '../../utils/logger';
import type { ConfigShowOptions, ConfigResult } from './types';

export async function handleConfigShowCommand(_options: ConfigShowOptions): Promise<ConfigResult> {
  try {
    logStep('Loading configuration...');
    const configResult = await loadConfig();
    console.log(JSON.stringify(configResult.config, null, 2));
    logSuccess('Configuration displayed');
    return { success: true, data: configResult.config };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to show config: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

