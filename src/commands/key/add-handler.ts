/**
 * Handler for 'delivr key add' command
 */

import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep, logSuccess } from '../../utils/logger';
import { LEGACY_COMMAND_TYPE_ACCESS_KEY_ADD } from './constants';
import type { KeyAddOptions, KeyResult } from './types';

export async function handleKeyAddCommand(
  options: KeyAddOptions
): Promise<KeyResult> {
  try {
    logStep(`Creating access key: ${options.name}`);

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

    // Wrap existing access-key add logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_ACCESS_KEY_ADD,
      name: options.name,
      ttl: options.ttl,
      serverUrl,
    });

    logSuccess(`Access key created: ${options.name}`);

    return {
      success: true,
      message: 'Access key created successfully',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to create access key: ${errorMessage}`);

    // Provide actionable hints
    if (errorMessage.includes('not logged in')) {
      console.log('\n💡 Tip: You need to login first');
      console.log('   - Run: delivr auth login');
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

