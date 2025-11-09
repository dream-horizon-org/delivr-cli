import { logInfo, logWarning } from '../../utils/logger';
import { COMING_SOON_MESSAGE } from './constants';
import type { DistributeStatusOptions } from './types';

/**
 * Handle distribute status command - shows distribution status
 * 
 * PLACEHOLDER: This is a noop handler until backend APIs are available
 */
export async function handleDistributeStatusCommand(
  options: DistributeStatusOptions
): Promise<void> {
  logWarning('Distribute status command is not yet implemented');
  logInfo(COMING_SOON_MESSAGE);
  
  logInfo(`Distribution ID: ${options.distributionId}`);
  
  return Promise.resolve();
}

