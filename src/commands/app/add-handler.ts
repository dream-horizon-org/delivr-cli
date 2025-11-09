/**
 * Handler for 'delivr app add' command
 */

import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_APP_ADD } from './constants';
import type { AppAddOptions, AppResult } from './types';

export async function handleAppAddCommand(
  options: AppAddOptions
): Promise<AppResult> {
  try {
    logStep(`Creating app: ${options.name}`);

    const configResult = await loadConfig({
      server: { url: options.serverUrl },
    });
    const config = configResult.config;
    const serverUrl = options.serverUrl || config.server?.url;

    if (serverUrl) {
      logInfo(`Server: ${serverUrl}`);
    }

    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_APP_ADD,
      appName: options.name,
      os: options.os,
      serverUrl,
    });

    logSuccess(`App created: ${options.name}`);
    return { success: true, message: 'App created successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to create app: ${errorMessage}`);
    
    if (errorMessage.includes('not logged in')) {
      console.log('\n💡 Tip: You need to login first');
      console.log('   - Run: delivr auth login');
    }
    
    return { success: false, error: errorMessage };
  }
}

