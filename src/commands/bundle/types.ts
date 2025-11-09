export interface BundleInspectOptions { bundlePath: string; }
export interface BundleValidateOptions { bundlePath: string; }
export interface BundleResult { success: boolean; message?: string; error?: string; data?: unknown; }

