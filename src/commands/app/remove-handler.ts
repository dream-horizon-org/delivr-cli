/**
 * Handler for 'delivr app remove' command
 */

import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_APP_REMOVE } from './constants';
import type { AppRemoveOptions, AppResult } from './types';

export async function handleAppRemoveCommand(
  options: AppRemoveOptions
): Promise<AppResult> {
  try {
    logStep(`Removing app: ${options.name}`);

    const configResult = await loadConfig({
      server: { url: options.serverUrl },
    });
    const config = configResult.config;
    const serverUrl = options.serverUrl || config.server?.url;

    if (serverUrl) {
      logInfo(`Server: ${serverUrl}`);
    }

    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_APP_REMOVE,
      appName: options.name,
      serverUrl,
    });

    logSuccess(`App removed: ${options.name}`);
    return { success: true, message: 'App removed successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to remove app: ${errorMessage}`);
    
    if (errorMessage.includes('not logged in')) {
      console.log('\n💡 Tip: You need to login first');
      console.log('   - Run: delivr auth login');
    }
    
    if (errorMessage.includes('not found')) {
      console.log('\n💡 Tip: Check your app name');
      console.log('   - Run: delivr app list');
    }
    
    return { success: false, error: errorMessage };
  }
}

