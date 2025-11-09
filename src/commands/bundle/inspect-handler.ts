import * as fs from 'fs';
import { logStep, logSuccess, logError, logInfo } from '../../utils/logger';
import type { BundleInspectOptions, BundleResult } from './types';

export async function handleBundleInspectCommand(options: BundleInspectOptions): Promise<BundleResult> {
  try {
    logStep(`Inspecting bundle: ${options.bundlePath}`);
    if (!fs.existsSync(options.bundlePath)) {
      logError('Bundle file not found');
      return { success: false, error: 'Bundle file not found' };
    }
    const stats = fs.statSync(options.bundlePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    logInfo(`Bundle size: ${sizeInMB} MB`);
    logInfo(`Last modified: ${stats.mtime.toISOString()}`);
    logSuccess('Bundle inspected successfully');
    return { success: true, data: { size: sizeInMB, modified: stats.mtime } };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logError(`Failed to inspect bundle: ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
}

