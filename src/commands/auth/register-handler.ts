/**
 * Handler for 'delivr auth register' command
 */

import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_REGISTER } from './constants';
import type { AuthRegisterOptions, AuthResult } from './types';

export async function handleRegisterCommand(
  options: AuthRegisterOptions
): Promise<AuthResult> {
  try {
    logStep('Registering new account...');

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

    // Wrap existing register logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_REGISTER,
      serverUrl,
    });

    logSuccess('Successfully registered!');

    return {
      success: true,
      message: 'Registration successful',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Registration failed: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

