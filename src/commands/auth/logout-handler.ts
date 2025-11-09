/**
 * Handler for 'delivr auth logout' command
 */

import { logStep, logSuccess, logError } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_LOGOUT } from './constants';
import type { AuthLogoutOptions, AuthResult } from './types';

export async function handleLogoutCommand(
  options: AuthLogoutOptions
): Promise<AuthResult> {
  try {
    logStep('Logging out...');

    // Wrap existing logout logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_LOGOUT,
      local: options.local,
    });

    logSuccess('Successfully logged out!');

    return {
      success: true,
      message: 'Logout successful',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Logout failed: ${errorMessage}`);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

