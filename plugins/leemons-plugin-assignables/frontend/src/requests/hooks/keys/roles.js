export const allRolesKeys = [
  {
    plugin: 'plugin.assignables',
    scope: 'roles',
  },
];

/*
 * ===
 * GET ROLES
 * ===
 */

export const allRolesGetKey = [
  {
    ...allRolesKeys[0],
    action: 'get',
  },
];

export const rolesGetKey = ({ role }) => [
  {
    ...allRolesGetKey[0],

    role,
  },
];

/*
 * ===
 * LIST ROLES
 * ===
 */

export const allRolesListKey = [
  {
    ...allRolesKeys[0],
    action: 'list',
  },
];

export const rolesListKey = ({ details }) => [
  {
    ...allRolesListKey[0],
    details,
  },
];
