#!/usr/bin/env node

/**
 * Delivr CLI - Main Entry Point
 * 
 * New command-line interface for Delivr (DOTA) Over-The-Air updates
 * 
 * This is a gradual migration from code-push-standalone:
 * - Wraps existing logic from script/ directory
 * - Adds better UX, defaults, and configuration
 * - Follows Dream11 code standards
 * - Coexists with code-push-standalone command
 * 
 * Strategy:
 * 1. Better defaults (Issue #2: visible folders, auto-detection)
 * 2. New config system (Issue #4: env vars, config files)
 * 3. Clear messaging and feedback
 * 4. Gradually migrate logic to src/
 * 
 * @see DELIVR_CLI_IMPLEMENTATION_GUIDE.md for implementation details
 * @see DEVX_ISSUES.md for issues being addressed
 */

import { parseAndExecute } from './commands/command-parser';
import { logError } from './utils/logger';
import { EXIT_CODE_ERROR } from './constants';

/**
 * Main entry point
 * 
 * Parses CLI arguments and executes commands
 */
async function main(): Promise<void> {
  try {
    await parseAndExecute();
  } catch (error) {
    // Handle any uncaught errors
    logError(
      `Unexpected error: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
    
    if (error instanceof Error && error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    process.exit(EXIT_CODE_ERROR);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  process.exit(EXIT_CODE_ERROR);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(EXIT_CODE_ERROR);
});

// Run main function
main();

