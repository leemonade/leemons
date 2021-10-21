const add = require('./add');

async function addMain() {
  return add({
    key: 'users',
    iconSvg: '/public/assets/svgs/user.svg',
    activeIconSvg: '/public/assets/svgs/userActive.svg',
    label: {
      en: 'Users',
      es: 'Usuarios',
    },
  });
}

module.exports = addMain;
