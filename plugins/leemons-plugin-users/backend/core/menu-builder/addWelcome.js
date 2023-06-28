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
        permissionName: 'plugins.users.users',
        actionNames: ['view', 'admin'],
      },
      {
        permissionName: 'plugins.users.profiles',
        actionNames: ['view', 'admin'],
      },
    ]
  );
}

module.exports = addWelcome;
