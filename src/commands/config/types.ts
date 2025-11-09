export interface ConfigShowOptions {}
export interface ConfigSetOptions { key: string; value: string; }
export interface ConfigGetOptions { key: string; }
export interface ConfigResult { success: boolean; message?: string; error?: string; data?: unknown; }

