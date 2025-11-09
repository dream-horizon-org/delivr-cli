/**
 * Output path detection and resolution
 * 
 * Barrel export for all output path utilities
 */

export {
    detectAndroidBuildOutput,
    getMostRecentAndroidBuild
} from './android-detector';
export * from './constants';
export { detectExpo } from './expo-detector';
export {
    detectIOSBuildOutput,
    getMostRecentIOSBuild
} from './ios-detector';
export {
    formatDetectionMessage, getDefaultOutputDir,
    getStandardizedOutputPath, resolveOutputPath
} from './path-resolver';
export * from './types';

