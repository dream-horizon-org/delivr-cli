export interface PatchCreateOptions { oldFile: string; newFile: string; outputFile: string; }
export interface PatchApplyOptions { oldFile: string; patchFile: string; outputFile: string; }
export interface PatchResult { success: boolean; message?: string; error?: string; }

