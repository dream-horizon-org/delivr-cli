import { loadConfig } from '../../config';
import { logStep, logSuccess, logError } from '../../utils/logger';
import type { ConfigGetOptions, ConfigResult } from './types';

export async function handleConfigGetCommand(options: ConfigGetOptions): Promise<ConfigResult> {
  try {
    logStep(`Getting config: ${options.key}`);
    const configResult = await loadConfig();
    const keys = options.key.split('.');
    let value: unknown = configResult.config;
    for (const key of keys) {
      if (typeof value === 'object' && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        value = undefined;
        break;
      }
    }
    console.log(value !== undefined ? JSON.stringify(value, null, 2) : 'undefined');
    logSuccess(`Config value retrieved`);
    return { success: true, data: value };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to get config: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

