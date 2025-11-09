/**
 * Handler for 'delivr auth login' command
 */

import { loadConfig } from '../../config';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { LEGACY_COMMAND_TYPE_LOGIN } from './constants';
import type { AuthLoginOptions, AuthResult } from './types';

export async function handleLoginCommand(
  options: AuthLoginOptions
): Promise<AuthResult> {
  try {
    logStep('Logging in to Delivr...');

    // Load config (priority: CLI args > config file > env vars)
    const configResult = await loadConfig({
      server: {
        url: options.serverUrl,
      },
      auth: {
        accessKey: options.accessKey,
      },
    });
    const config = configResult.config;

    // Merge options with config
    const serverUrl = options.serverUrl || config.server?.url;
    const accessKey = options.accessKey || config.auth?.accessKey;

    if (serverUrl) {
      logInfo(`Server: ${serverUrl}`);
    }

    // Wrap existing login logic
    await executeLegacyCommand({
      type: LEGACY_COMMAND_TYPE_LOGIN,
      accessKey,
      serverUrl,
      proxy: options.proxy,
      noProxy: options.noProxy,
    });

    logSuccess('Successfully logged in!');

    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Login failed: ${errorMessage}`);

    // Provide actionable hints
    if (errorMessage.includes('Invalid access key')) {
      console.log('\n💡 Tip: Check your access key');
      console.log('   - Get your key from: delivr key add "My Key"');
      console.log('   - Or set env var: export DELIVR_ACCESS_KEY=your-key');
    }

    if (errorMessage.includes('network') || errorMessage.includes('ECONNREFUSED')) {
      console.log('\n💡 Tip: Check your server URL');
      console.log('   - Set env var: export DELIVR_SERVER_URL=https://your-server.com');
      console.log('   - Or use flag: delivr auth login --serverUrl https://your-server.com');
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

