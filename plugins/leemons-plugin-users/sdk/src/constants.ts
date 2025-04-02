export const PLUGIN_NAME = 'users';
export const CENTER_ASSETS_PERMISSION_PREFIX = `${PLUGIN_NAME}.center.assets`;

export const SYS_PROFILE_NAMES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ADMIN: 'admin',
  CONTENT_DEVELOPER: 'content-developer',
} as const;

export type SysProfileName = (typeof SYS_PROFILE_NAMES)[keyof typeof SYS_PROFILE_NAMES];
