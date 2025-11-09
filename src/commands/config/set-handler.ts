import * as fs from 'fs';
import * as path from 'path';
import { logStep, logSuccess, logError } from '../../utils/logger';
import { CONFIG_FILE } from './constants';
import type { ConfigSetOptions, ConfigResult } from './types';

export async function handleConfigSetCommand(options: ConfigSetOptions): Promise<ConfigResult> {
  try {
    logStep(`Setting config: ${options.key} = ${options.value}`);
    const configPath = path.join(process.cwd(), CONFIG_FILE);
    let config: Record<string, unknown> = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
    const keys = options.key.split('.');
    let current: Record<string, unknown> = config;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (key === undefined) break;
      if (!current[key]) current[key] = {};
      current = current[key] as Record<string, unknown>;
    }
    const finalKey = keys[keys.length - 1];
    if (finalKey) current[finalKey] = options.value;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    logSuccess(`Config updated: ${options.key}`);
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to set config: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

