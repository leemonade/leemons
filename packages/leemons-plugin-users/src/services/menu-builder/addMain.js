const add = require('./add');

async function addMain() {
  return add({
    key: 'users',
    iconSvg: '/public/users/menu-icon.svg',
    activeIconSvg: '/public/users/menu-icon.svg',
    label: {
      en: 'Users',
      es: 'Usuarios',
    },
  });
}

module.exports = addMain;
