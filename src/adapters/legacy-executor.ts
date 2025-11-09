/**
 * Legacy executor adapter
 * 
 * Bridges new delivr CLI to existing code-push-standalone logic in script/ directory
 * This allows us to wrap existing battle-tested code with better UX
 * without modifying the original implementation
 */

import {
  DEFAULT_DEPLOYMENT_NAME,
  DEFAULT_ROLLOUT_PERCENTAGE,
  LEGACY_COMMAND_TYPE_RELEASE_REACT,
  PLACEHOLDER_RELEASE_LABEL,
  SUPPORTED_PLATFORMS,
} from '../commands/release/constants';
import type { ReleaseOptions, ReleaseResult, ValidatedReleaseOptions } from '../commands/release/types';

/**
 * Legacy command format expected by script/command-executor.ts
 * 
 * This type mirrors the structure expected by the existing CLI
 * without importing from script/ to avoid circular dependencies
 */
interface LegacyCommand {
  type: string;
  appName?: string;
  platform?: string;
  deploymentName?: string;
  targetBinaryVersion?: string;
  outputDir?: string;
  description?: string;
  mandatory?: boolean;
  disabled?: boolean;
  rollout?: number;
  serverUrl?: string;
  accessKey?: string;
  proxy?: string;
  noProxy?: boolean;
  local?: boolean;
  format?: string;
  [key: string]: unknown;
}

/**
 * Convert new release options to legacy command format
 * 
 * Maps new CLI options to the format expected by existing command-executor.ts
 * Includes all bundle-specific, React Native build, and Hermes options
 */
export function convertToLegacyCommand(options: ReleaseOptions): LegacyCommand {
  return {
    type: LEGACY_COMMAND_TYPE_RELEASE_REACT,
    appName: options.appName,
    platform: options.platform,
    deploymentName: options.deploymentName ?? DEFAULT_DEPLOYMENT_NAME,
    targetBinaryVersion: options.targetBinaryVersion,
    outputDir: options.outputDir,
    description: options.description,
    mandatory: options.mandatory ?? false,
    disabled: options.disabled ?? false,
    rollout: options.rollout ?? DEFAULT_ROLLOUT_PERCENTAGE,
    serverUrl: options.serverUrl,
    accessKey: options.accessKey,
    
    // Bundle-specific options
    compression: options.compression,
    isPatch: options.isPatch,
    bundleName: options.bundleName,
    development: options.development,
    entryFile: options.entryFile,
    sourcemapOutput: options.sourcemapOutput,
    config: options.config,
    
    // Android-specific options
    gradleFile: options.gradleFile,
    
    // iOS-specific options
    plistFile: options.plistFile,
    plistFilePrefix: options.plistFilePrefix,
    podFile: options.podFile,
    xcodeProjectFile: options.xcodeProjectFile,
    xcodeTargetName: options.xcodeTargetName,
    buildConfigurationName: options.buildConfigurationName,
    
    // Hermes options
    useHermes: options.useHermes,
    extraHermesFlags: options.extraHermesFlags,
  };
}

/**
 * Generic function to execute any legacy command
 * 
 * This wraps the existing execute() function from script/command-executor.ts
 * and bridges the new delivr CLI to the existing code-push-standalone logic
 * 
 * Uses require() to avoid TypeScript compilation of script/ folder
 */
export function executeLegacyCommand(command: LegacyCommand): Promise<void> {
  // Dynamically require the command executor to avoid TypeScript compilation issues
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const commandExecutor = require('../../script/command-executor');
  
  // Call the existing execute function from script/command-executor.ts
  // This bridges new delivr CLI to battle-tested code-push-standalone logic
  return commandExecutor.execute(command)
    .then(() => {
      // Successfully executed
      return Promise.resolve();
    })
    .catch((error: Error) => {
      // Propagate error from legacy executor
      return Promise.reject(error);
    });
}

/**
 * Execute release using legacy command-executor
 * 
 * This function calls the existing execute() from script/command-executor.ts
 * with the release-react command format
 * 
 * Uses require() to avoid TypeScript compilation of script/ folder
 */
export async function executeLegacyRelease(
  options: ReleaseOptions
): Promise<ReleaseResult> {
  // Convert to legacy command format
  const legacyCommand = convertToLegacyCommand(options);
  
  try {
    // Dynamically require the command executor to avoid TypeScript compilation issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const commandExecutor = require('../../script/command-executor');
    
    // Call the existing execute function from script/command-executor.ts
    // This will execute the full release-react workflow
    await commandExecutor.execute(legacyCommand);
    
    // If we get here, the release was successful
    return {
      success: true,
      bundlePath: legacyCommand.outputDir,
      releaseLabel: PLACEHOLDER_RELEASE_LABEL, // Legacy executor doesn't return label
    };
  } catch (error) {
    // Return error result
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Validate release options before executing
 * 
 * Performs basic validation to catch common errors early
 */
export function validateReleaseOptions(
  options: ReleaseOptions
): { valid: true; validated: ValidatedReleaseOptions } | { valid: false; error: string } {
  if (!options.appName || options.appName.trim() === '') {
    return {
      valid: false,
      error: 'App name is required',
    };
  }
  
  if (!options.platform || !SUPPORTED_PLATFORMS.includes(options.platform)) {
    return {
      valid: false,
      error: `Platform must be one of: ${SUPPORTED_PLATFORMS.join(', ')}`,
    };
  }
  
  if (!options.targetBinaryVersion || options.targetBinaryVersion.trim() === '') {
    return {
      valid: false,
      error: 'Target binary version is required',
    };
  }
  
  if (options.rollout !== undefined) {
    if (options.rollout < 1 || options.rollout > 100) {
      return {
        valid: false,
        error: 'Rollout must be between 1 and 100',
      };
    }
  }
  
  // Return validated options with required fields guaranteed
  return {
    valid: true,
    validated: {
      ...options,
      appName: options.appName,
      targetBinaryVersion: options.targetBinaryVersion,
      deploymentName: options.deploymentName ?? DEFAULT_DEPLOYMENT_NAME,
      outputDir: options.outputDir ?? '',
    } as ValidatedReleaseOptions,
  };
}

