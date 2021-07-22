const add = require('./add');

async function addMain() {
  return add({
    key: 'users',
    iconSvg: '/assets/svgs/user.svg',
    activeIconSvg: '/assets/svgs/userActive.svg',
    label: {
      en: 'Users',
      es: 'Usuarios',
    },
  });
}

module.exports = addMain;
