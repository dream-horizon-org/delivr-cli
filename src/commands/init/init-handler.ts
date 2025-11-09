/**
 * Init command handler
 * 
 * Creates a .delivrrc configuration file with detected defaults
 * Makes it easy for users to set up their project
 */

import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';
import { detectPackageInfo, formatAppName } from '../../utils/package-detector';
import { isInteractiveSupported } from '../../utils/prompts';
import {
  logStep,
  logInfo,
  logSuccess,
  logError,
  logPath,
  logSeparator,
  logWarning,
} from '../../utils/logger';
import {
  DEFAULT_CONFIG_FILE_NAME,
  DEFAULT_DEPLOYMENT_NAME,
  DEFAULT_SERVER_URL,
  PROMPT_APP_NAME_MESSAGE,
  PROMPT_SERVER_URL_MESSAGE,
  PROMPT_ACCESS_KEY_MESSAGE,
} from './constants';
import type { InitOptions, InitResult, InitConfig } from './types';

/**
 * Handle init command
 * 
 * Creates .delivrrc with detected or prompted values
 */
export async function handleInitCommand(
  options: InitOptions = {}
): Promise<InitResult> {
  try {
    logStep('Initializing Delivr CLI configuration...');
    logSeparator();
    
    const projectRoot = process.cwd();
    const configPath = path.join(projectRoot, DEFAULT_CONFIG_FILE_NAME);
    
    // Check if config already exists
    if (fs.existsSync(configPath) && !options.force) {
      logWarning(`Config file already exists: ${configPath}`);
      logInfo('Use --force to overwrite existing config');
      return {
        success: false,
        error: 'Config file already exists. Use --force to overwrite.',
      };
    }
    
    // Step 1: Detect from package.json
    logInfo('Detecting defaults from package.json...');
    const packageInfo = detectPackageInfo({
      projectRoot,
      verbose: options.verbose,
    });
    
    let detectedAppName: string | undefined;
    if (packageInfo.found && packageInfo.name) {
      detectedAppName = formatAppName(packageInfo.name);
      logInfo(`✓ Detected app name: ${detectedAppName}`);
    }
    
    logSeparator();
    
    // Step 2: Interactive prompts (if enabled and supported)
    const config: InitConfig = {
      deploymentName: DEFAULT_DEPLOYMENT_NAME,
    };
    
    if (detectedAppName) {
      config.appName = detectedAppName;
    }
    
    const interactive = options.interactive !== false;
    const interactiveSupported = isInteractiveSupported();
    
    if (interactive && interactiveSupported) {
      logInfo('Please provide configuration values (press Enter to skip):');
      
      const answers = await prompts(
        [
          {
            type: 'text',
            name: 'appName',
            message: PROMPT_APP_NAME_MESSAGE,
            initial: detectedAppName ?? '',
          },
          {
            type: 'text',
            name: 'serverUrl',
            message: PROMPT_SERVER_URL_MESSAGE,
            initial: DEFAULT_SERVER_URL,
          },
          {
            type: 'password',
            name: 'accessKey',
            message: PROMPT_ACCESS_KEY_MESSAGE,
          },
        ],
        {
          onCancel: () => {
            logWarning('\nInitialization cancelled');
            process.exit(0);
          },
        }
      );
      
      // Apply prompted values (only if non-empty)
      if (answers.appName?.trim()) {
        config.appName = answers.appName.trim();
      }
      
      if (answers.serverUrl?.trim()) {
        config.server = {
          url: answers.serverUrl.trim(),
        };
      }
      
      if (answers.accessKey?.trim()) {
        config.auth = {
          accessKey: answers.accessKey.trim(),
        };
      }
    } else if (interactive && !interactiveSupported) {
      logInfo('Interactive mode not supported (non-TTY environment)');
      logInfo('Using detected defaults only');
    }
    
    logSeparator();
    
    // Step 3: Create config file
    logInfo('Creating configuration file...');
    
    const configJson = JSON.stringify(config, null, 2);
    
    try {
      fs.writeFileSync(configPath, configJson, 'utf8');
      
      logSeparator();
      logSuccess('Configuration file created successfully!');
      logPath('Location', configPath);
      logSeparator();
      
      // Show config summary
      logInfo('Configuration:');
      if (config.appName) {
        logPath('App Name', config.appName);
      }
      if (config.deploymentName) {
        logPath('Deployment', config.deploymentName);
      }
      if (config.server?.url) {
        logPath('Server URL', config.server.url);
      }
      if (config.auth?.accessKey) {
        logPath('Access Key', `***${config.auth.accessKey.slice(-4)}`);
      }
      
      logSeparator();
      logInfo('💡 Tip: You can now run releases without specifying these values!');
      logInfo('   Example: delivr release react ios');
      
      return {
        success: true,
        configPath,
      };
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Unknown error';
      logError(`Failed to write config file: ${errorMsg}`);
      return {
        success: false,
        error: `Failed to write config: ${errorMsg}`,
      };
    }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    logError(`Init failed: ${errorMsg}`);
    return {
      success: false,
      error: errorMsg,
    };
  }
}


