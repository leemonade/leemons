const add = require('./add');

// TODO ESPERANDO A MIGRAR MENU BUILDER
async function addMain() {
  return add(
    {
      key: 'users',
      order: 100,
      iconSvg: '/public/users/menu-icon.svg',
      activeIconSvg: '/public/users/menu-icon.svg',
      label: {
        en: 'Users',
        es: 'Usuarios',
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

module.exports = addMain;
