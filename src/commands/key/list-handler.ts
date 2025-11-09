/**
 * Handler for 'delivr key list' command
 */

import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep } from '../../utils/logger';
import { DEFAULT_FORMAT, LEGACY_COMMAND_TYPE_ACCESS_KEY_LIST } from './constants';
import type { KeyListOptions, KeyResult } from './types';

export async function handleKeyListCommand(
  options: KeyListOptions
): Promise<KeyResult> {
  try {
    logStep('Fetching access keys...');

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

    // Wrap existing access-key list logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_ACCESS_KEY_LIST,
      serverUrl,
      format: options.format ?? DEFAULT_FORMAT,
    });

    return {
      success: true,
      message: 'Access keys fetched',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to fetch access keys: ${errorMessage}`);

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

