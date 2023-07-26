const add = require('./add');

// TODO ESPERANDO A MIGRAR MENU BUILDER
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
        permissionName: 'users.users',
        actionNames: ['admin'],
      },
    ]
  );
}

module.exports = addUsers;
