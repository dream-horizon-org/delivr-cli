/**
 * Handler for 'delivr app transfer' command
 */

import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_APP_TRANSFER } from './constants';
import type { AppTransferOptions, AppResult } from './types';

export async function handleAppTransferCommand(
  options: AppTransferOptions
): Promise<AppResult> {
  try {
    logStep(`Transferring app: ${options.appName} → ${options.email}`);

    const configResult = await loadConfig({
      server: { url: options.serverUrl },
    });
    const config = configResult.config;
    const serverUrl = options.serverUrl || config.server?.url;

    if (serverUrl) {
      logInfo(`Server: ${serverUrl}`);
    }

    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_APP_TRANSFER,
      appName: options.appName,
      email: options.email,
      serverUrl,
    });

    logSuccess(`App transferred: ${options.appName} → ${options.email}`);
    return { success: true, message: 'App transferred successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to transfer app: ${errorMessage}`);
    
    if (errorMessage.includes('not logged in')) {
      console.log('\n💡 Tip: You need to login first');
      console.log('   - Run: delivr auth login');
    }
    
    if (errorMessage.includes('not found')) {
      console.log('\n💡 Tip: Check your app name and email');
      console.log('   - Run: delivr app list');
    }
    
    return { success: false, error: errorMessage };
  }
}

