/**
 * Handler for 'delivr auth whoami' command
 */

import { loadConfig } from '../../config';
import { logStep, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_WHOAMI, DEFAULT_FORMAT } from './constants';
import type { AuthWhoamiOptions, AuthResult } from './types';

export async function handleWhoamiCommand(
  options: AuthWhoamiOptions
): Promise<AuthResult> {
  try {
    logStep('Fetching current user...');

    // Load config
    const configResult = await loadConfig({
      server: {
        url: options.serverUrl,
      },
    });
    const config = configResult.config;
    const serverUrl = options.serverUrl || config.server?.url;

    if (serverUrl) {
      logInfo(`Server: ${serverUrl}`);
    }

    // Wrap existing whoami logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_WHOAMI,
      serverUrl,
      format: options.format || DEFAULT_FORMAT,
    });

    return {
      success: true,
      message: 'Fetched user info',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to fetch user info: ${errorMessage}`);

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

