/**
 * Release command handler
 * 
 * Main handler for release commands that:
 * 1. Uses new configuration system
 * 2. Auto-detects build outputs
 * 3. Provides better defaults
 * 4. Shows clear messaging
 * 5. Wraps existing logic from script/command-executor.ts
 * 
 * This implements the solution for Issue #2 (Hidden Output Folder)
 */

import {
  executeLegacyRelease,
  validateReleaseOptions,
} from '../../adapters/legacy-executor';
import { loadConfig } from '../../config';
import { isSamePath } from '../../utils/bundle-copier';
import {
  logError,
  logInfo,
  logPath,
  logSeparator,
  logStep,
  logSuccess,
  logWarning,
} from '../../utils/logger';
import {
  getStandardizedOutputPath,
  Platform,
  resolveOutputPath,
} from '../../utils/output-paths';
import {
  detectPackageInfo,
  formatAppName,
} from '../../utils/package-detector';
import {
  isInteractiveSupported,
  promptForReleaseInfo,
} from '../../utils/prompts';
import {
  DEFAULT_DEPLOYMENT_NAME,
  DEFAULT_TARGET_BINARY_VERSION,
} from './constants';
import type { ReleaseOptions, ReleaseResult } from './types';

/**
 * Handle release command
 * 
 * Main entry point for release operations
 * Coordinates config loading, path detection, validation, and execution
 */
export async function handleReleaseCommand(
  options: ReleaseOptions
): Promise<ReleaseResult> {
  try {
    logStep('Starting release process...');
    logSeparator();
    
    // Step 1: Load configuration (uses new config system ✅)
    logInfo('Loading configuration...');
    const config = await loadConfig({
      server: {
        url: options.serverUrl,
      },
      auth: {
        accessKey: options.accessKey,
      },
    });
    
    // Step 2: Determine final output location
    logInfo(`Determining output location for ${options.platform}...`);
    
    let finalOutputPath: string;
    
    if (options.outputDir) {
      // User provided explicit path - respect it (no standardization)
      finalOutputPath = options.outputDir;
      logInfo('Using user-provided output directory');
      logPath('Output', finalOutputPath);
    } else {
      // No user path - use standardized location
      finalOutputPath = getStandardizedOutputPath(
        options.platform as Platform,
        process.cwd()
      );
      
      // Show detection info for context (but we'll use standardized location)
      const pathResult = resolveOutputPath({
        userOutputDir: undefined,
        platform: options.platform as Platform,
        projectRoot: process.cwd(),
        verbose: options.verbose,
      });
      
      if (pathResult.detected && !isSamePath(pathResult.path, finalOutputPath)) {
        // We detected a build, but we'll use standardized location instead
        logInfo(`Detected build at: ${pathResult.path}`);
        logInfo(`Using standardized location: ${finalOutputPath}`);
      } else {
        logInfo(`Using standardized location: ${finalOutputPath}`);
      }
    }
    
    logSeparator();
    
    // Step 3: Build final options with resolved values
    const finalOptions: ReleaseOptions = {
      ...options,
      outputDir: finalOutputPath,
      deploymentName: options.deploymentName ?? DEFAULT_DEPLOYMENT_NAME,
      serverUrl: config.config.server?.url ?? options.serverUrl,
      accessKey: config.config.auth?.accessKey ?? options.accessKey,
    };
    
    // Step 4: Validate options
    logInfo('Validating release options...');
    const validation = validateReleaseOptions(finalOptions);
    
    if (!validation.valid) {
      // Type narrowing: when valid is false, error property exists
      logError(`Validation failed: ${(validation as { valid: false; error: string }).error}`);
      return {
        success: false,
        error: (validation as { valid: false; error: string }).error,
      };
    }
    
    // Type narrowing: when valid is true, validated property exists
    const validatedOptions = validation.validated;
    
    logSuccess('Validation passed');
    logSeparator();
    
    // Step 5: Show release summary
    // Using validated options, all required fields are guaranteed to be present
    logStep('Release Summary:');
    logPath('App', validatedOptions.appName);
    logPath('Platform', validatedOptions.platform);
    logPath('Deployment', validatedOptions.deploymentName);
    logPath('Version', validatedOptions.targetBinaryVersion);
    logPath('Output', validatedOptions.outputDir ?? 'Not specified');
    logSeparator();
    
    // Step 6: Execute release (wraps existing logic)
    logStep('Creating and uploading bundle...');
    const result = await executeLegacyRelease(validatedOptions);
    
    if (result.success) {
      logSeparator();
      logSuccess('Release completed successfully!');
      if (result.bundlePath) {
        logPath('Bundle location', result.bundlePath);
      }
      if (result.releaseLabel) {
        logPath('Release label', result.releaseLabel);
      }
    } else {
      logSeparator();
      logError(`Release failed: ${result.error}`);
    }
    
    return result;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logError(`Release failed: ${errorMessage}`);
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Handle release-react command (alias)
 * 
 * Convenience wrapper for React Native releases
 * Auto-detects app name and version from package.json if not provided
 */
export async function handleReleaseReactCommand(
  appName: string | undefined,
  platform: 'ios' | 'android',
  options: Partial<ReleaseOptions>
): Promise<ReleaseResult> {
  let resolvedAppName = appName;
  let resolvedVersion = options.targetBinaryVersion;
  
  // Step 1: Auto-detect from package.json if needed
  if (!resolvedAppName || !resolvedVersion) {
    if (options.verbose) {
      logInfo('Auto-detecting app name and version from package.json...');
    }
    
    const packageInfo = detectPackageInfo({
      projectRoot: process.cwd(),
      verbose: options.verbose,
    });
    
    if (packageInfo.found) {
      // Use detected app name if not provided
      if (!resolvedAppName && packageInfo.name) {
        resolvedAppName = formatAppName(packageInfo.name);
        logInfo(`✓ Detected app name: ${resolvedAppName}`);
      }
      
      // Use detected version if not provided
      if (!resolvedVersion && packageInfo.version) {
        resolvedVersion = packageInfo.version;
        logInfo(`✓ Detected version: ${resolvedVersion}`);
      }
    }
  }
  
  // Step 2: Interactive prompts for still-missing values
  if (!resolvedAppName || !resolvedVersion) {
    const interactive = options.interactive !== false; // Default to true
    const interactiveSupported = isInteractiveSupported();
    
    if (interactive && interactiveSupported) {
      // Prompt for missing values
      logInfo('\nSome values are missing. Please provide them:');
      
      const promptAnswers = await promptForReleaseInfo(
        resolvedAppName,
        resolvedVersion,
        {
          interactive: true,
          verbose: options.verbose,
        }
      );
      
      // Apply prompted values
      if (promptAnswers.appName) {
        resolvedAppName = promptAnswers.appName;
      }
      if (promptAnswers.targetBinaryVersion) {
        resolvedVersion = promptAnswers.targetBinaryVersion;
      }
    } else if (!interactive || !interactiveSupported) {
      // Not interactive or not supported - fail with clear error
      const missingFields: string[] = [];
      if (!resolvedAppName) missingFields.push('app name');
      if (!resolvedVersion) missingFields.push('version');
      
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}. ${
        !interactiveSupported
          ? 'Interactive prompts not available in this environment (non-TTY). '
          : ''
      }Please provide these values via command-line arguments or package.json.`;
      
      logError(errorMsg);
      return {
        success: false,
        error: errorMsg,
      };
    }
  }
  
  // Step 3: Final fallback validation
  if (!resolvedAppName) {
    const errorMsg = 'App name is required but could not be determined.';
    logError(errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
  
  if (!resolvedVersion) {
    logWarning(`Version not provided. Using default: ${DEFAULT_TARGET_BINARY_VERSION}`);
    resolvedVersion = DEFAULT_TARGET_BINARY_VERSION;
  }
  
  // Merge with defaults
  const fullOptions: ReleaseOptions = {
    appName: resolvedAppName,
    platform,
    targetBinaryVersion: resolvedVersion,
    deploymentName: options.deploymentName ?? DEFAULT_DEPLOYMENT_NAME,
    outputDir: options.outputDir,
    verbose: options.verbose,
    description: options.description,
    mandatory: options.mandatory,
    disabled: options.disabled,
    rollout: options.rollout,
    serverUrl: options.serverUrl,
    accessKey: options.accessKey,
  };
  
  return handleReleaseCommand(fullOptions);
}

