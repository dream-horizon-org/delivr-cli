export interface OrgListOptions { serverUrl?: string; format?: 'json' | 'table'; }
export interface OrgRemoveOptions { orgName: string; serverUrl?: string; }
export interface OrgResult { success: boolean; message?: string; error?: string; data?: unknown; }

