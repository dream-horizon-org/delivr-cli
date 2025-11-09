/**
 * Handler for 'delivr auth link' command
 */

import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_LINK } from './constants';
import type { AuthLinkOptions, AuthResult } from './types';

export async function handleLinkCommand(
  options: AuthLinkOptions
): Promise<AuthResult> {
  try {
    logStep('Linking additional auth provider...');

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

    // Wrap existing link logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_LINK,
      serverUrl,
    });

    logSuccess('Successfully linked!');

    return {
      success: true,
      message: 'Link successful',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Link failed: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

