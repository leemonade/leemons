const add = require('./add');

async function addUsers() {
  return add(
    {
      key: 'users-list',
      order: 3,
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
        actionNames: ['admin'],
      },
    ]
  );
}

module.exports = addUsers;
