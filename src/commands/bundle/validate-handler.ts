import * as fs from 'fs';
import { logStep, logSuccess, logError, logInfo, logWarning } from '../../utils/logger';
import { MAX_BUNDLE_SIZE_MB } from './constants';
import type { BundleValidateOptions, BundleResult } from './types';

export async function handleBundleValidateCommand(options: BundleValidateOptions): Promise<BundleResult> {
  try {
    logStep(`Validating bundle: ${options.bundlePath}`);
    if (!fs.existsSync(options.bundlePath)) {
      logError('Bundle file not found');
      return { success: false, error: 'Bundle file not found' };
    }
    const stats = fs.statSync(options.bundlePath);
    const sizeInMB = stats.size / (1024 * 1024);
    if (sizeInMB > MAX_BUNDLE_SIZE_MB) {
      logWarning(`Bundle size (${sizeInMB.toFixed(2)} MB) exceeds recommended maximum (${MAX_BUNDLE_SIZE_MB} MB)`);
    } else {
      logInfo(`Bundle size: ${sizeInMB.toFixed(2)} MB`);
    }
    logSuccess('Bundle validation complete');
    return { success: true, data: { valid: sizeInMB <= MAX_BUNDLE_SIZE_MB, size: sizeInMB } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to validate bundle: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

