import add from './add';

async function addUsers() {
  return add(
    {
      key: 'user-list',
      parentKey: 'users',
      url: '/users/private/users/list',
      label: {
        en: 'Users list',
        es: 'Listado de usuarios',
      },
    },
    [
      {
        permissionName: 'plugins.users.users',
        actionNames: ['view'],
      },
    ]
  );
}

module.exports = addUsers;
