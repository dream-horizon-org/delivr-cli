export interface CollaboratorAddOptions { appName: string; email: string; serverUrl?: string; }
export interface CollaboratorListOptions { appName: string; serverUrl?: string; format?: 'json' | 'table'; }
export interface CollaboratorRemoveOptions { appName: string; email: string; serverUrl?: string; }
export interface CollaboratorResult { success: boolean; message?: string; error?: string; data?: unknown; }

