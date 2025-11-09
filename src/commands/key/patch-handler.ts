/**
 * Handler for 'delivr key patch' command
 */

import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep, logSuccess } from '../../utils/logger';
import { LEGACY_COMMAND_TYPE_ACCESS_KEY_PATCH } from './constants';
import type { KeyPatchOptions, KeyResult } from './types';

export async function handleKeyPatchCommand(
  options: KeyPatchOptions
): Promise<KeyResult> {
  try {
    logStep(`Updating access key: ${options.oldName}`);

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

    // Wrap existing access-key patch logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_ACCESS_KEY_PATCH,
      oldName: options.oldName,
      newName: options.newName,
      ttl: options.ttl,
      serverUrl,
    });

    logSuccess(`Access key updated: ${options.oldName}`);

    return {
      success: true,
      message: 'Access key updated successfully',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to update access key: ${errorMessage}`);

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

