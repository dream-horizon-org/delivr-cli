import { executeLegacyCommand } from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { logError, logInfo, logStep, logSuccess } from '../../utils/logger';
import { LEGACY_COMMAND_TYPE_ORG_REMOVE } from './constants';
import type { OrgRemoveOptions, OrgResult } from './types';

export async function handleOrgRemoveCommand(options: OrgRemoveOptions): Promise<OrgResult> {
  try {
    logStep(`Removing organization: ${options.orgName}`);
    const configResult = await loadConfig({ server: { url: options.serverUrl } });
    const serverUrl = options.serverUrl ?? configResult.config.server?.url;
    if (serverUrl) logInfo(`Server: ${serverUrl}`);
    await executeLegacyCommand({ type: LEGACY_COMMAND_TYPE_ORG_REMOVE, orgName: options.orgName, serverUrl });
    logSuccess(`Organization removed: ${options.orgName}`);
    return { success: true, message: 'Organization removed successfully' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to remove organization: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

