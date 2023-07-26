const add = require('./add');

// TODO ESPERANDO A MIGRAR MENU BUILDER
async function addUserData() {
  return add(
    {
      key: 'user-data',
      parentKey: 'users',
      order: 2,
      url: '/private/users/user-data',
      label: {
        en: 'User data',
        es: 'Datos del usuario',
      },
    },
    [
      {
        permissionName: 'users.user-data',
        actionNames: ['view', 'admin'],
      },
    ]
  );
}

module.exports = addUserData;
