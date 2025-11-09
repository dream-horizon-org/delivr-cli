import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep } from '../../utils/logger';
import { DEFAULT_FORMAT, LEGACY_COMMAND_TYPE_ORG_LIST } from './constants';
import type { OrgListOptions, OrgResult } from './types';

export async function handleOrgListCommand(options: OrgListOptions): Promise<OrgResult> {
  try {
    logStep('Fetching organizations...');
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl ?? configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_ORG_LIST, serverUrl, format: options.format ?? DEFAULT_FORMAT });
    return { success: true, message: 'Organizations fetched' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to fetch organizations: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

