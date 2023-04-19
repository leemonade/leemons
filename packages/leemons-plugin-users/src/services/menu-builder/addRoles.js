const add = require('./add');

async function addRoles() {
  return add(
    {
      key: 'roles-list',
      order: 1,
      parentKey: 'users',
      url: '/private/users/roles/list',
      label: {
        en: 'Roles',
        es: 'Roles',
      },
    },
    [
      {
        permissionName: 'plugins.users.roles',
        actionNames: ['view', 'admin'],
      },
    ]
  );
}

module.exports = addRoles;
