/**
 * Type definitions for auth commands
 */

export interface AuthLoginOptions {
  accessKey?: string;
  serverUrl?: string;
  proxy?: string;
  noProxy?: boolean;
}

export interface AuthRegisterOptions {
  serverUrl?: string;
}

export interface AuthLinkOptions {
  serverUrl?: string;
}

export interface AuthWhoamiOptions {
  serverUrl?: string;
  format?: 'json' | 'table';
}

export interface AuthLogoutOptions {
  local?: boolean;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
}

