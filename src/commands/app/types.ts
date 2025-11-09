/**
 * Type definitions for app management commands
 */

export interface AppAddOptions {
  name: string;
  os?: string;
  serverUrl?: string;
}

export interface AppListOptions {
  serverUrl?: string;
  format?: 'json' | 'table';
  org?: string;
}

export interface AppRemoveOptions {
  name: string;
  serverUrl?: string;
}

export interface AppRenameOptions {
  currentName: string;
  newName: string;
  serverUrl?: string;
}

export interface AppTransferOptions {
  appName: string;
  email: string;
  serverUrl?: string;
}

export interface AppResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

