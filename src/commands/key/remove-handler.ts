/**
 * Handler for 'delivr key remove' command
 */

import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep, logSuccess } from '../../utils/logger';
import { LEGACY_COMMAND_TYPE_ACCESS_KEY_REMOVE } from './constants';
import type { KeyRemoveOptions, KeyResult } from './types';

export async function handleKeyRemoveCommand(
  options: KeyRemoveOptions
): Promise<KeyResult> {
  try {
    logStep(`Removing access key: ${options.name}`);

    // Load config
    const configResult = await loadConfig({
      server: {
        url: options.serverUrl,
      },
    });
    const config = configResult.config;
    const serverUrl = options.serverUrl ?? config.server?.url;

    if (serverUrl) {
      logInfo(`Server: ${serverUrl}`);
    }

    // Wrap existing access-key remove logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_ACCESS_KEY_REMOVE,
      name: options.name,
      serverUrl,
    });

    logSuccess(`Access key removed: ${options.name}`);

    return {
      success: true,
      message: 'Access key removed successfully',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to remove access key: ${errorMessage}`);

    // Provide actionable hints
    if (errorMessage.includes('not logged in')) {
      console.log('\n💡 Tip: You need to login first');
      console.log('   - Run: delivr auth login');
    }

    if (errorMessage.includes('not found')) {
      console.log('\n💡 Tip: Check your access key name');
      console.log('   - Run: delivr key list');
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

