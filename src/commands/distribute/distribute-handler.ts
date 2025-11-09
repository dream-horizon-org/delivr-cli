import { logInfo, logWarning } from '../../utils/logger';
import { COMING_SOON_MESSAGE } from './constants';
import type { DistributeOptions, DistributeResult } from './types';

/**
 * Handle distribute command - distributes assets to various targets
 * 
 * PLACEHOLDER: This is a noop handler until backend APIs are available
 */
export async function handleDistributeCommand(
  options: DistributeOptions
): Promise<DistributeResult> {
  logWarning('Distribute command is not yet implemented');
  logInfo(COMING_SOON_MESSAGE);
  
  logInfo(`Asset: ${options.asset}`);
  logInfo(`Target: ${Array.isArray(options.target) ? options.target.join(', ') : options.target}`);
  
  return {
    success: false,
    error: 'Not implemented - backend API support required',
  };
}

