/**
 * Command parser for delivr CLI
 * 
 * Parses command-line arguments and routes to appropriate handlers
 * Uses yargs for robust argument parsing
 * 
 * This is Phase 1 - implements basic release command
 * Future phases will add more commands (auth, app, deployment, etc.)
 */

import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CLI_GITHUB_URL, CLI_NAME, CLI_VERSION, EXIT_CODE_ERROR } from '../constants';
import { logError } from '../utils/logger';
import { handleInitCommand } from './init';
import { handleReleaseReactCommand } from './release';
import {
  handleLoginCommand,
  handleLogoutCommand,
  handleRegisterCommand,
  handleLinkCommand,
  handleWhoamiCommand,
} from './auth';
import {
  handleKeyAddCommand,
  handleKeyListCommand,
  handleKeyRemoveCommand,
  handleKeyPatchCommand,
} from './key';
import {
  handleAppAddCommand,
  handleAppListCommand,
  handleAppRemoveCommand,
  handleAppRenameCommand,
  handleAppTransferCommand,
} from './app';
import {
  handleDeploymentAddCommand,
  handleDeploymentListCommand,
  handleDeploymentRemoveCommand,
  handleDeploymentRenameCommand,
  handleDeploymentHistoryCommand,
  handleDeploymentClearCommand,
} from './deployment';
import {
  handleOrgListCommand,
  handleOrgRemoveCommand,
} from './org';
import {
  handleCollaboratorAddCommand,
  handleCollaboratorListCommand,
  handleCollaboratorRemoveCommand,
} from './collaborator';
import {
  handlePatchCreateCommand,
  handlePatchApplyCommand,
} from './patch';
import {
  handleSessionListCommand,
  handleSessionRemoveCommand,
} from './session';
import { handleDebugCommand } from './debug';
import {
  handleConfigShowCommand,
  handleConfigSetCommand,
  handleConfigGetCommand,
} from './config';
import {
  handleBundleInspectCommand,
  handleBundleValidateCommand,
} from './bundle';

/**
 * Create and configure CLI parser
 * 
 * Sets up command structure, options, and help text
 */
export function createParser(): Argv {
  return yargs(hideBin(process.argv))
    .scriptName(CLI_NAME)
    .usage('Usage: $0 <command> [options]')
    .command(
      'init',
      'Initialize Delivr configuration file (.delivrrc)',
      (yargs) => {
        return yargs
          .option('force', {
            alias: 'f',
            describe: 'Overwrite existing config file',
            type: 'boolean',
            default: false,
          })
          .option('no-interactive', {
            describe: 'Disable interactive prompts',
            type: 'boolean',
            default: false,
          })
          .option('verbose', {
            alias: 'v',
            describe: 'Verbose output',
            type: 'boolean',
            default: false,
          })
          .example('$0 init', 'Create .delivrrc with interactive prompts')
          .example('$0 init --force', 'Overwrite existing .delivrrc')
          .example(
            '$0 init --no-interactive',
            'Create .delivrrc without prompts (CI/CD)'
          );
      },
      async (argv) => {
        try {
          await handleInitCommand({
            force: argv.force as boolean,
            interactive: !(argv.noInteractive as boolean),
            verbose: argv.verbose as boolean,
          });
        } catch (error) {
          logError(
            `Failed to initialize: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
          process.exit(EXIT_CODE_ERROR);
        }
      }
    )
    .command(
      'auth <command>',
      'Authentication commands',
      (yargs) => {
        return yargs
          .command(
            'login',
            'Login to Delivr server',
            (yargs) => {
              return yargs
                .option('access-key', {
                  alias: 'k',
                  describe: 'Access key for authentication',
                  type: 'string',
                })
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .option('proxy', {
                  describe: 'Proxy server URL',
                  type: 'string',
                })
                .option('no-proxy', {
                  describe: 'Disable proxy',
                  type: 'boolean',
                  default: false,
                })
                .example('$0 auth login', 'Login interactively')
                .example('$0 auth login --access-key YOUR_KEY', 'Login with access key')
                .example('$0 auth login --server-url https://api.delivr.com', 'Login to specific server');
            },
            async (argv) => {
              try {
                await handleLoginCommand({
                  accessKey: argv.accessKey as string | undefined,
                  serverUrl: argv.serverUrl as string | undefined,
                  proxy: argv.proxy as string | undefined,
                  noProxy: argv.noProxy as boolean,
                });
              } catch (error) {
                logError(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'logout',
            'Logout from Delivr server',
            (yargs) => {
              return yargs
                .option('local', {
                  describe: 'Logout locally only',
                  type: 'boolean',
                  default: false,
                })
                .example('$0 auth logout', 'Logout from server')
                .example('$0 auth logout --local', 'Logout locally only');
            },
            async (argv) => {
              try {
                await handleLogoutCommand({
                  local: argv.local as boolean,
                });
              } catch (error) {
                logError(`Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'register',
            'Register a new account',
            (yargs) => {
              return yargs
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 auth register', 'Register interactively');
            },
            async (argv) => {
              try {
                await handleRegisterCommand({
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'link',
            'Link additional auth provider',
            (yargs) => {
              return yargs
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 auth link', 'Link auth provider');
            },
            async (argv) => {
              try {
                await handleLinkCommand({
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Link failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'whoami',
            'Show current user info',
            (yargs) => {
              return yargs
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .option('format', {
                  alias: 'f',
                  describe: 'Output format',
                  choices: ['json', 'table'] as const,
                  default: 'table',
                })
                .example('$0 auth whoami', 'Show current user')
                .example('$0 auth whoami --format json', 'Show user info as JSON');
            },
            async (argv) => {
              try {
                await handleWhoamiCommand({
                  serverUrl: argv.serverUrl as string | undefined,
                  format: argv.format as 'json' | 'table',
                });
              } catch (error) {
                logError(`Failed to get user info: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          );
      }
    )
    .command(
      'key <command>',
      'Access key management commands',
      (yargs) => {
        return yargs
          .command(
            'add <name>',
            'Create a new access key',
            (yargs) => {
              return yargs
                .positional('name', {
                  describe: 'Name for the access key',
                  type: 'string',
                  demandOption: true,
                })
                .option('ttl', {
                  describe: 'Time to live (e.g., "30d", "1y")',
                  type: 'string',
                })
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 key add "CI Key"', 'Create access key for CI')
                .example('$0 key add "Dev Key" --ttl 30d', 'Create key with 30 day expiry');
            },
            async (argv) => {
              try {
                await handleKeyAddCommand({
                  name: argv.name as string,
                  ttl: argv.ttl as string | undefined,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed to create access key: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            ['list', 'ls'],
            'List all access keys',
            (yargs) => {
              return yargs
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .option('format', {
                  alias: 'f',
                  describe: 'Output format',
                  choices: ['json', 'table'] as const,
                  default: 'table',
                })
                .example('$0 key list', 'List all access keys')
                .example('$0 key ls --format json', 'List keys as JSON');
            },
            async (argv) => {
              try {
                await handleKeyListCommand({
                  serverUrl: argv.serverUrl as string | undefined,
                  format: argv.format as 'json' | 'table',
                });
              } catch (error) {
                logError(`Failed to list access keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            ['remove <name>', 'rm <name>'],
            'Remove an access key',
            (yargs) => {
              return yargs
                .positional('name', {
                  describe: 'Name of the access key to remove',
                  type: 'string',
                  demandOption: true,
                })
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 key remove "CI Key"', 'Remove access key')
                .example('$0 key rm "Old Key"', 'Remove using alias');
            },
            async (argv) => {
              try {
                await handleKeyRemoveCommand({
                  name: argv.name as string,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed to remove access key: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'patch <name>',
            'Update an access key',
            (yargs) => {
              return yargs
                .positional('name', {
                  describe: 'Current name of the access key',
                  type: 'string',
                  demandOption: true,
                })
                .option('new-name', {
                  alias: 'n',
                  describe: 'New name for the access key',
                  type: 'string',
                })
                .option('ttl', {
                  describe: 'New time to live (e.g., "30d", "1y")',
                  type: 'string',
                })
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 key patch "Old Name" --new-name "New Name"', 'Rename access key')
                .example('$0 key patch "CI Key" --ttl 60d', 'Update key expiry');
            },
            async (argv) => {
              try {
                await handleKeyPatchCommand({
                  oldName: argv.name as string,
                  newName: argv.newName as string | undefined,
                  ttl: argv.ttl as string | undefined,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed to update access key: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          );
      }
    )
    .command(
      'app <command>',
      'App management commands',
      (yargs) => {
        return yargs
          .command(
            'add <name>',
            'Create a new app',
            (yargs) => {
              return yargs
                .positional('name', {
                  describe: 'Name for the app',
                  type: 'string',
                  demandOption: true,
                })
                .option('os', {
                  describe: 'Target OS (ios, android, or both)',
                  type: 'string',
                })
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 app add MyApp', 'Create new app')
                .example('$0 app add MyApp --os ios', 'Create iOS-only app');
            },
            async (argv) => {
              try {
                await handleAppAddCommand({
                  name: argv.name as string,
                  os: argv.os as string | undefined,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed to create app: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            ['list', 'ls'],
            'List all apps',
            (yargs) => {
              return yargs
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .option('format', {
                  alias: 'f',
                  describe: 'Output format',
                  choices: ['json', 'table'] as const,
                  default: 'table',
                })
                .option('org', {
                  describe: 'Filter by organization',
                  type: 'string',
                })
                .example('$0 app list', 'List all apps')
                .example('$0 app ls --format json', 'List apps as JSON');
            },
            async (argv) => {
              try {
                await handleAppListCommand({
                  serverUrl: argv.serverUrl as string | undefined,
                  format: argv.format as 'json' | 'table',
                  org: argv.org as string | undefined,
                });
              } catch (error) {
                logError(`Failed to list apps: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            ['remove <name>', 'rm <name>'],
            'Remove an app',
            (yargs) => {
              return yargs
                .positional('name', {
                  describe: 'Name of the app to remove',
                  type: 'string',
                  demandOption: true,
                })
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 app remove MyApp', 'Remove app')
                .example('$0 app rm OldApp', 'Remove using alias');
            },
            async (argv) => {
              try {
                await handleAppRemoveCommand({
                  name: argv.name as string,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed to remove app: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'rename <currentName> <newName>',
            'Rename an app',
            (yargs) => {
              return yargs
                .positional('currentName', {
                  describe: 'Current name of the app',
                  type: 'string',
                  demandOption: true,
                })
                .positional('newName', {
                  describe: 'New name for the app',
                  type: 'string',
                  demandOption: true,
                })
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 app rename OldName NewName', 'Rename app');
            },
            async (argv) => {
              try {
                await handleAppRenameCommand({
                  currentName: argv.currentName as string,
                  newName: argv.newName as string,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed to rename app: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'transfer <appName> <email>',
            'Transfer app to another account',
            (yargs) => {
              return yargs
                .positional('appName', {
                  describe: 'Name of the app to transfer',
                  type: 'string',
                  demandOption: true,
                })
                .positional('email', {
                  describe: 'Email of the new owner',
                  type: 'string',
                  demandOption: true,
                })
                .option('server-url', {
                  alias: 's',
                  describe: 'Server URL',
                  type: 'string',
                })
                .example('$0 app transfer MyApp user@example.com', 'Transfer app');
            },
            async (argv) => {
              try {
                await handleAppTransferCommand({
                  appName: argv.appName as string,
                  email: argv.email as string,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed to transfer app: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          );
      }
    )
    .command(
      'deployment <command>',
      'Deployment management commands',
      (yargs) => {
        return yargs
          .command(
            'add <appName> <deploymentName>',
            'Create a new deployment',
            (yargs) => {
              return yargs
                .positional('appName', { describe: 'App name', type: 'string', demandOption: true })
                .positional('deploymentName', { describe: 'Deployment name', type: 'string', demandOption: true })
                .option('server-url', { alias: 's', describe: 'Server URL', type: 'string' })
                .example('$0 deployment add MyApp Production', 'Create deployment');
            },
            async (argv) => {
              try {
                await handleDeploymentAddCommand({
                  appName: argv.appName as string,
                  deploymentName: argv.deploymentName as string,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            ['list <appName>', 'ls <appName>'],
            'List deployments',
            (yargs) => {
              return yargs
                .positional('appName', { describe: 'App name', type: 'string', demandOption: true })
                .option('server-url', { alias: 's', describe: 'Server URL', type: 'string' })
                .option('format', { alias: 'f', describe: 'Output format', choices: ['json', 'table'] as const, default: 'table' })
                .example('$0 deployment list MyApp', 'List deployments');
            },
            async (argv) => {
              try {
                await handleDeploymentListCommand({
                  appName: argv.appName as string,
                  serverUrl: argv.serverUrl as string | undefined,
                  format: argv.format as 'json' | 'table',
                });
              } catch (error) {
                logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            ['remove <appName> <deploymentName>', 'rm <appName> <deploymentName>'],
            'Remove a deployment',
            (yargs) => {
              return yargs
                .positional('appName', { describe: 'App name', type: 'string', demandOption: true })
                .positional('deploymentName', { describe: 'Deployment name', type: 'string', demandOption: true })
                .option('server-url', { alias: 's', describe: 'Server URL', type: 'string' })
                .example('$0 deployment remove MyApp Staging', 'Remove deployment');
            },
            async (argv) => {
              try {
                await handleDeploymentRemoveCommand({
                  appName: argv.appName as string,
                  deploymentName: argv.deploymentName as string,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'rename <appName> <currentName> <newName>',
            'Rename a deployment',
            (yargs) => {
              return yargs
                .positional('appName', { describe: 'App name', type: 'string', demandOption: true })
                .positional('currentName', { describe: 'Current deployment name', type: 'string', demandOption: true })
                .positional('newName', { describe: 'New deployment name', type: 'string', demandOption: true })
                .option('server-url', { alias: 's', describe: 'Server URL', type: 'string' })
                .example('$0 deployment rename MyApp Staging Production', 'Rename deployment');
            },
            async (argv) => {
              try {
                await handleDeploymentRenameCommand({
                  appName: argv.appName as string,
                  currentName: argv.currentName as string,
                  newName: argv.newName as string,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'history <appName> <deploymentName>',
            'Show deployment history',
            (yargs) => {
              return yargs
                .positional('appName', { describe: 'App name', type: 'string', demandOption: true })
                .positional('deploymentName', { describe: 'Deployment name', type: 'string', demandOption: true })
                .option('server-url', { alias: 's', describe: 'Server URL', type: 'string' })
                .option('format', { alias: 'f', describe: 'Output format', choices: ['json', 'table'] as const, default: 'table' })
                .example('$0 deployment history MyApp Production', 'Show history');
            },
            async (argv) => {
              try {
                await handleDeploymentHistoryCommand({
                  appName: argv.appName as string,
                  deploymentName: argv.deploymentName as string,
                  serverUrl: argv.serverUrl as string | undefined,
                  format: argv.format as 'json' | 'table',
                });
              } catch (error) {
                logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          )
          .command(
            'clear <appName> <deploymentName>',
            'Clear deployment history',
            (yargs) => {
              return yargs
                .positional('appName', { describe: 'App name', type: 'string', demandOption: true })
                .positional('deploymentName', { describe: 'Deployment name', type: 'string', demandOption: true })
                .option('server-url', { alias: 's', describe: 'Server URL', type: 'string' })
                .example('$0 deployment clear MyApp Staging', 'Clear history');
            },
            async (argv) => {
              try {
                await handleDeploymentClearCommand({
                  appName: argv.appName as string,
                  deploymentName: argv.deploymentName as string,
                  serverUrl: argv.serverUrl as string | undefined,
                });
              } catch (error) {
                logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                process.exit(EXIT_CODE_ERROR);
              }
            }
          );
      }
    )
    .command(
      'release <command>',
      'Release management commands',
      (yargs) => {
        return yargs.command(
          'react [appName] <platform>',
          'Create and release a React Native bundle',
          (yargs) => {
            return yargs
              .positional('appName', {
                describe: 'Name of the app (auto-detected from package.json if not provided)',
                type: 'string',
                demandOption: false,
              })
              .positional('platform', {
                describe: 'Platform to release for',
                choices: ['ios', 'android'] as const,
                demandOption: true,
              })
              .option('deployment', {
                alias: 'd',
                describe: 'Deployment name',
                type: 'string',
                default: 'Staging',
              })
              .option('target-binary-version', {
                alias: 't',
                describe: 'Target binary version (auto-detected from package.json if not provided)',
                type: 'string',
                demandOption: false,
              })
              .option('output-dir', {
                alias: 'o',
                describe: 'Output directory for bundles',
                type: 'string',
              })
              .option('description', {
                alias: 'desc',
                describe: 'Release description',
                type: 'string',
              })
              .option('mandatory', {
                alias: 'm',
                describe: 'Whether this is a mandatory update',
                type: 'boolean',
                default: false,
              })
              .option('disabled', {
                describe: 'Whether to disable this update',
                type: 'boolean',
                default: false,
              })
              .option('rollout', {
                alias: 'r',
                describe: 'Rollout percentage (1-100)',
                type: 'number',
                default: 100,
              })
              .option('server-url', {
                describe: 'Server URL',
                type: 'string',
              })
              .option('access-key', {
                alias: 'k',
                describe: 'Access key',
                type: 'string',
              })
              .option('verbose', {
                alias: 'v',
                describe: 'Verbose output',
                type: 'boolean',
                default: false,
              })
              .option('no-interactive', {
                describe: 'Disable interactive prompts (for CI/CD)',
                type: 'boolean',
                default: false,
              })
              // Bundle-specific options
              .option('compression', {
                alias: 'c',
                describe: 'Compression algorithm: deflate (default) or brotli',
                choices: ['deflate', 'brotli'] as const,
                default: 'deflate',
              })
              .option('is-patch', {
                describe: 'Whether this is a patch bundle (vs full bundle)',
                type: 'boolean',
                default: false,
              })
              .option('bundle-name', {
                alias: 'b',
                describe: 'Custom bundle name (e.g., main.jsbundle, index.android.bundle)',
                type: 'string',
              })
              .option('development', {
                describe: 'Create a development bundle',
                type: 'boolean',
                default: false,
              })
              .option('entry-file', {
                describe: 'Custom entry file path (e.g., index.js)',
                type: 'string',
              })
              .option('sourcemap-output', {
                describe: 'Path where sourcemap should be written',
                type: 'string',
              })
              .option('config', {
                describe: 'Path to React Native config file',
                type: 'string',
              })
              // Android-specific options
              .option('gradle-file', {
                describe: 'Path to custom Android gradle file',
                type: 'string',
              })
              // iOS-specific options
              .option('plist-file', {
                describe: 'Path to custom iOS plist file',
                type: 'string',
              })
              .option('plist-file-prefix', {
                describe: 'Prefix for plist file',
                type: 'string',
              })
              .option('pod-file', {
                describe: 'Path to Podfile',
                type: 'string',
              })
              .option('xcode-project-file', {
                describe: 'Xcode project file path',
                type: 'string',
              })
              .option('xcode-target-name', {
                describe: 'Xcode target name',
                type: 'string',
              })
              .option('build-configuration-name', {
                describe: 'Build configuration name (e.g., Release)',
                type: 'string',
              })
              // Hermes options
              .option('use-hermes', {
                describe: 'Use Hermes engine and generate bytecode',
                type: 'boolean',
                default: false,
              })
              .option('extra-hermes-flags', {
                describe: 'Additional flags for Hermes compiler (comma-separated)',
                type: 'string',
              })
              .example(
                '$0 release react ios',
                'Release iOS bundle (auto-detects app name & version from package.json)'
              )
              .example(
                '$0 release react android -d Production',
                'Release Android bundle to Production (auto-detects app name & version)'
              )
              .example(
                '$0 release react MyApp-iOS ios -t 1.0.0',
                'Release iOS bundle with explicit app name and version'
              )
              .example(
                '$0 release react ios -o ./custom/output',
                'Release with custom output directory'
              )
              .example(
                '$0 release react android --compression brotli',
                'Release with Brotli compression for smaller bundle size'
              )
              .example(
                '$0 release react ios --use-hermes',
                'Release with Hermes bytecode enabled'
              )
              .example(
                '$0 release react android --development',
                'Release development bundle for debugging'
              )
              .example(
                '$0 release react ios --is-patch --bundle-name update.jsbundle',
                'Release patch bundle with custom name'
              );
          },
          async (argv) => {
            try {
              // Parse extra Hermes flags if provided
              const extraHermesFlags = argv.extraHermesFlags
                ? (argv.extraHermesFlags as string).split(',').map((flag) => flag.trim())
                : undefined;
              
              await handleReleaseReactCommand(
                argv.appName as string | undefined,
                argv.platform as 'ios' | 'android',
                {
                  targetBinaryVersion: argv.targetBinaryVersion as string | undefined,
                  deploymentName: argv.deployment as string,
                  outputDir: argv.outputDir as string | undefined,
                  description: argv.description as string | undefined,
                  mandatory: argv.mandatory as boolean,
                  disabled: argv.disabled as boolean,
                  rollout: argv.rollout as number,
                  serverUrl: argv.serverUrl as string | undefined,
                  accessKey: argv.accessKey as string | undefined,
                  verbose: argv.verbose as boolean,
                  interactive: !(argv.noInteractive as boolean),
                  
                  // Bundle-specific options
                  compression: argv.compression as 'deflate' | 'brotli' | undefined,
                  isPatch: argv.isPatch as boolean | undefined,
                  bundleName: argv.bundleName as string | undefined,
                  development: argv.development as boolean | undefined,
                  entryFile: argv.entryFile as string | undefined,
                  sourcemapOutput: argv.sourcemapOutput as string | undefined,
                  config: argv.config as string | undefined,
                  
                  // Android-specific options
                  gradleFile: argv.gradleFile as string | undefined,
                  
                  // iOS-specific options
                  plistFile: argv.plistFile as string | undefined,
                  plistFilePrefix: argv.plistFilePrefix as string | undefined,
                  podFile: argv.podFile as string | undefined,
                  xcodeProjectFile: argv.xcodeProjectFile as string | undefined,
                  xcodeTargetName: argv.xcodeTargetName as string | undefined,
                  buildConfigurationName: argv.buildConfigurationName as string | undefined,
                  
                  // Hermes options
                  useHermes: argv.useHermes as boolean | undefined,
                  extraHermesFlags,
                }
              );
            } catch (error) {
              logError(
                `Failed to execute command: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`
              );
              process.exit(EXIT_CODE_ERROR);
            }
          }
        );
      }
    )
    .command('org <command>', 'Organization management', (yargs) => yargs
      .command(['list', 'ls'], 'List organizations', (yargs) => yargs.option('server-url', { alias: 's', type: 'string' }).option('format', { alias: 'f', choices: ['json', 'table'] as const, default: 'table' }), async (argv) => { try { await handleOrgListCommand({ serverUrl: argv.serverUrl as string | undefined, format: argv.format as 'json' | 'table' }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
      .command(['remove <name>', 'rm <name>'], 'Remove organization', (yargs) => yargs.positional('name', { type: 'string', demandOption: true }).option('server-url', { alias: 's', type: 'string' }), async (argv) => { try { await handleOrgRemoveCommand({ orgName: argv.name as string, serverUrl: argv.serverUrl as string | undefined }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
    )
    .command('collaborator <command>', 'Collaborator management', (yargs) => yargs
      .command('add <appName> <email>', 'Add collaborator', (yargs) => yargs.positional('appName', { type: 'string', demandOption: true }).positional('email', { type: 'string', demandOption: true }).option('server-url', { alias: 's', type: 'string' }), async (argv) => { try { await handleCollaboratorAddCommand({ appName: argv.appName as string, email: argv.email as string, serverUrl: argv.serverUrl as string | undefined }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
      .command(['list <appName>', 'ls <appName>'], 'List collaborators', (yargs) => yargs.positional('appName', { type: 'string', demandOption: true }).option('server-url', { alias: 's', type: 'string' }).option('format', { alias: 'f', choices: ['json', 'table'] as const, default: 'table' }), async (argv) => { try { await handleCollaboratorListCommand({ appName: argv.appName as string, serverUrl: argv.serverUrl as string | undefined, format: argv.format as 'json' | 'table' }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
      .command(['remove <appName> <email>', 'rm <appName> <email>'], 'Remove collaborator', (yargs) => yargs.positional('appName', { type: 'string', demandOption: true }).positional('email', { type: 'string', demandOption: true }).option('server-url', { alias: 's', type: 'string' }), async (argv) => { try { await handleCollaboratorRemoveCommand({ appName: argv.appName as string, email: argv.email as string, serverUrl: argv.serverUrl as string | undefined }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
    )
    .command('patch <command>', 'Patch file operations', (yargs) => yargs
      .command('create <oldFile> <newFile> <outputFile>', 'Create patch', (yargs) => yargs.positional('oldFile', { type: 'string', demandOption: true }).positional('newFile', { type: 'string', demandOption: true }).positional('outputFile', { type: 'string', demandOption: true }), async (argv) => { try { await handlePatchCreateCommand({ oldFile: argv.oldFile as string, newFile: argv.newFile as string, outputFile: argv.outputFile as string }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
      .command('apply <oldFile> <patchFile> <outputFile>', 'Apply patch', (yargs) => yargs.positional('oldFile', { type: 'string', demandOption: true }).positional('patchFile', { type: 'string', demandOption: true }).positional('outputFile', { type: 'string', demandOption: true }), async (argv) => { try { await handlePatchApplyCommand({ oldFile: argv.oldFile as string, patchFile: argv.patchFile as string, outputFile: argv.outputFile as string }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
    )
    .command('session <command>', 'Session management', (yargs) => yargs
      .command(['list', 'ls'], 'List sessions', (yargs) => yargs.option('server-url', { alias: 's', type: 'string' }).option('format', { alias: 'f', choices: ['json', 'table'] as const, default: 'table' }), async (argv) => { try { await handleSessionListCommand({ serverUrl: argv.serverUrl as string | undefined, format: argv.format as 'json' | 'table' }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
      .command(['remove <machine>', 'rm <machine>'], 'Remove session', (yargs) => yargs.positional('machine', { type: 'string', demandOption: true }).option('server-url', { alias: 's', type: 'string' }), async (argv) => { try { await handleSessionRemoveCommand({ machine: argv.machine as string, serverUrl: argv.serverUrl as string | undefined }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
    )
    .command('debug <platform>', 'Start debug session', (yargs) => yargs.positional('platform', { choices: ['ios', 'android'] as const, demandOption: true }), async (argv) => { try { await handleDebugCommand({ platform: argv.platform as 'ios' | 'android' }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
    .command('config <command>', 'Configuration management', (yargs) => yargs
      .command('show', 'Show configuration', () => {}, async () => { try { await handleConfigShowCommand({}); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
      .command('set <key> <value>', 'Set config value', (yargs) => yargs.positional('key', { type: 'string', demandOption: true }).positional('value', { type: 'string', demandOption: true }), async (argv) => { try { await handleConfigSetCommand({ key: argv.key as string, value: argv.value as string }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
      .command('get <key>', 'Get config value', (yargs) => yargs.positional('key', { type: 'string', demandOption: true }), async (argv) => { try { await handleConfigGetCommand({ key: argv.key as string }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
    )
    .command('bundle <command>', 'Bundle operations', (yargs) => yargs
      .command('inspect <bundlePath>', 'Inspect bundle', (yargs) => yargs.positional('bundlePath', { type: 'string', demandOption: true }), async (argv) => { try { await handleBundleInspectCommand({ bundlePath: argv.bundlePath as string }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
      .command('validate <bundlePath>', 'Validate bundle', (yargs) => yargs.positional('bundlePath', { type: 'string', demandOption: true }), async (argv) => { try { await handleBundleValidateCommand({ bundlePath: argv.bundlePath as string }); } catch (error) { logError(`Failed: ${error instanceof Error ? error.message : 'Unknown error'}`); process.exit(EXIT_CODE_ERROR); } })
    )
    .demandCommand(1, 'You must provide a command')
    .strict()
    .help('h')
    .alias('h', 'help')
    .version(CLI_VERSION)
    .alias('v', 'version')
    .epilogue(`For more information, visit: ${CLI_GITHUB_URL}`);
}

/**
 * Parse and execute CLI commands
 * 
 * Main entry point for command parsing
 */
export async function parseAndExecute(): Promise<void> {
  const parser = createParser();
  
  try {
    await parser.parseAsync();
  } catch (error) {
    logError(
      `Command execution failed: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    process.exit(EXIT_CODE_ERROR);
  }
}

