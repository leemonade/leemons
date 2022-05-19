const add = require('./add');

async function addMain() {
  return add({
    key: 'users',
    order: 5,
    iconSvg: '/public/users/menu-icon.svg',
    activeIconSvg: '/public/users/menu-icon.svg',
    label: {
      en: 'Users',
      es: 'Usuarios',
    },
  });
}

module.exports = addMain;
