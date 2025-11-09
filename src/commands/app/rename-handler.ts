/**
 * Handler for 'delivr app rename' command
 */

import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_APP_RENAME } from './constants';
import type { AppRenameOptions, AppResult } from './types';

export async function handleAppRenameCommand(
  options: AppRenameOptions
): Promise<AppResult> {
  try {
    logStep(`Renaming app: ${options.currentName} → ${options.newName}`);

    const configResult = await loadConfig({
      server: { url: options.serverUrl },
    });
    const config = configResult.config;
    const serverUrl = options.serverUrl || config.server?.url;

    if (serverUrl) {
      logInfo(`Server: ${serverUrl}`);
    }

    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_APP_RENAME,
      currentAppName: options.currentName,
      newAppName: options.newName,
      serverUrl,
    });

    logSuccess(`App renamed: ${options.currentName} → ${options.newName}`);
    return { success: true, message: 'App renamed successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to rename app: ${errorMessage}`);
    
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

