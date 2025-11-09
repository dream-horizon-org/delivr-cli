/**
 * Type definitions for deployment management commands
 */

export interface DeploymentAddOptions {
  appName: string;
  deploymentName: string;
  serverUrl?: string;
}

export interface DeploymentListOptions {
  appName: string;
  serverUrl?: string;
  format?: 'json' | 'table';
}

export interface DeploymentRemoveOptions {
  appName: string;
  deploymentName: string;
  serverUrl?: string;
}

export interface DeploymentRenameOptions {
  appName: string;
  currentName: string;
  newName: string;
  serverUrl?: string;
}

export interface DeploymentHistoryOptions {
  appName: string;
  deploymentName: string;
  serverUrl?: string;
  format?: 'json' | 'table';
}

export interface DeploymentClearOptions {
  appName: string;
  deploymentName: string;
  serverUrl?: string;
}

export interface DeploymentResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

