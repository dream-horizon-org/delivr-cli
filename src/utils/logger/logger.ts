/**
 * Logger utility for CLI output
 * 
 * Provides consistent, user-friendly console output with colors and formatting
 */

/**
 * Log an informational message
 */
export function logInfo(message: string): void {
  console.log(`ℹ️  ${message}`);
}

/**
 * Log a success message
 */
export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
}

/**
 * Log a warning message
 */
export function logWarning(message: string): void {
  console.warn(`⚠️  ${message}`);
}

/**
 * Log an error message
 */
export function logError(message: string): void {
  console.error(`❌ ${message}`);
}

/**
 * Log a step in a process
 */
export function logStep(step: string): void {
  console.log(`\n📋 ${step}`);
}

/**
 * Log a path or file location
 */
export function logPath(label: string, filePath: string): void {
  console.log(`   ${label}: ${filePath}`);
}

/**
 * Log a separator line
 */
export function logSeparator(): void {
  console.log('---');
}

/**
 * Log verbose debug information (only if verbose mode enabled)
 */
export function logVerbose(message: string, verbose?: boolean): void {
  if (verbose) {
    console.log(`🔍 ${message}`);
  }
}

/**
 * Log a header with formatting
 */
export function logHeader(title: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${title}`);
  console.log(`${'='.repeat(60)}\n`);
}

