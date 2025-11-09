/**
 * Handler for 'delivr app list' command
 */

import { loadConfig } from '../../config';
import { logStep, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_APP_LIST, DEFAULT_FORMAT } from './constants';
import type { AppListOptions, AppResult } from './types';

export async function handleAppListCommand(
  options: AppListOptions
): Promise<AppResult> {
  try {
    logStep('Fetching apps...');

    const configResult = await loadConfig({
      server: { url: options.serverUrl },
    });
    const config = configResult.config;
    const serverUrl = options.serverUrl || config.server?.url;

    if (serverUrl) {
      logInfo(`Server: ${serverUrl}`);
    }

    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_APP_LIST,
      serverUrl,
      format: options.format || DEFAULT_FORMAT,
      org: options.org,
    });

    return { success: true, message: 'Apps fetched' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to fetch apps: ${errorMessage}`);
    
    if (errorMessage.includes('not logged in')) {
      console.log('\n💡 Tip: You need to login first');
      console.log('   - Run: delivr auth login');
    }
    
    return { success: false, error: errorMessage };
  }
}

