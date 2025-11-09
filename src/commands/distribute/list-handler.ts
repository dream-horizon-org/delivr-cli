import { logInfo, logWarning } from '../../utils/logger';
import { COMING_SOON_MESSAGE } from './constants';
import type { DistributeListOptions } from './types';

/**
 * Handle distribute list command - lists previous distributions
 * 
 * PLACEHOLDER: This is a noop handler until backend APIs are available
 */
export async function handleDistributeListCommand(
  options: DistributeListOptions
): Promise<void> {
  logWarning('Distribute list command is not yet implemented');
  logInfo(COMING_SOON_MESSAGE);
  
  if (options.target) {
    logInfo(`Target filter: ${options.target}`);
  }
  
  return Promise.resolve();
}

