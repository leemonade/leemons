const add = require('./add');

async function addUsers() {
  return add(
    {
      key: 'users-list',
      parentKey: 'users',
      url: '/private/users/list',
      label: {
        en: 'Users list',
        es: 'Listado de usuarios',
      },
    },
    [
      {
        permissionName: 'plugins.users.users',
        actionNames: ['view', 'admin'],
      },
    ]
  );
}

module.exports = addUsers;
