const add = require('./add');

// TODO ESPERANDO A MIGRAR MENU BUILDER
async function addWelcome() {
  return add(
    {
      key: 'welcome',
      parentKey: 'users',
      url: '/private/users/welcome',
      label: {
        en: 'Welcome',
        es: 'Bienvenida',
      },
    },
    [
      {
        permissionName: 'users.users',
        actionNames: ['view', 'admin'],
      },
      {
        permissionName: 'users.profiles',
        actionNames: ['view', 'admin'],
      },
    ]
  );
}

module.exports = addWelcome;
