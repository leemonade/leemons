export const allRolesKeys = [
  {
    plugin: 'plugin.assignables',
    scope: 'roles',
  },
];

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
