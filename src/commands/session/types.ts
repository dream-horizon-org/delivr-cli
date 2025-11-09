export interface SessionListOptions { serverUrl?: string; format?: 'json' | 'table'; }
export interface SessionRemoveOptions { machine: string; serverUrl?: string; }
export interface SessionResult { success: boolean; message?: string; error?: string; }

