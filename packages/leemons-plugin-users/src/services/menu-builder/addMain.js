import add from './add';

async function addMain() {
  return add({
    key: 'users',
    iconSvg: '/users/svgs/user.svg',
    activeIconSvg: '/users/svgs/userActive.svg',
    label: {
      en: 'Users',
      es: 'Usuarios',
    },
  });
}

module.exports = addMain;
