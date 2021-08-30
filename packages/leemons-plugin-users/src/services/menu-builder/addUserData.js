const add = require('./add');

async function addUserData() {
  return add(
    {
      key: 'user-data',
      parentKey: 'users',
      url: '/users/private/user-data',
      label: {
        en: 'User data',
        es: 'Datos del usuario',
      },
    },
    [
      {
        permissionName: 'plugins.users.user-data',
        actionNames: ['view', 'admin'],
      },
    ]
  );
}

module.exports = addUserData;
