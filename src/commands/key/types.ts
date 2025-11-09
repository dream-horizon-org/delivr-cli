/**
 * Type definitions for key (access-key) commands
 */

export interface KeyAddOptions {
  name: string;
  ttl?: string;
  serverUrl?: string;
}

export interface KeyListOptions {
  serverUrl?: string;
  format?: 'json' | 'table';
}

export interface KeyRemoveOptions {
  name: string;
  serverUrl?: string;
}

export interface KeyPatchOptions {
  oldName: string;
  newName?: string;
  ttl?: string;
  serverUrl?: string;
}

export interface KeyResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

