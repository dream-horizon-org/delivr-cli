/**
 * Barrel exports for auth commands
 */

export { handleLoginCommand } from './login-handler';
export { handleLogoutCommand } from './logout-handler';
export { handleRegisterCommand } from './register-handler';
export { handleLinkCommand } from './link-handler';
export { handleWhoamiCommand } from './whoami-handler';

export type {
  AuthLoginOptions,
  AuthLogoutOptions,
  AuthRegisterOptions,
  AuthLinkOptions,
  AuthWhoamiOptions,
  AuthResult,
} from './types';

export {
  LEGACY_COMMAND_TYPE_LOGIN,
  LEGACY_COMMAND_TYPE_LOGOUT,
  LEGACY_COMMAND_TYPE_REGISTER,
  LEGACY_COMMAND_TYPE_LINK,
  LEGACY_COMMAND_TYPE_WHOAMI,
  DEFAULT_FORMAT,
} from './constants';

