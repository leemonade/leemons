const add = require('./add');

async function addWelcome() {
  return add(
    {
      key: 'welcome',
      order: 1,
      parentKey: 'classroom',
      url: '/classroom/private/welcome',
      label: {
        en: 'Welcome',
        es: 'Bienvenida',
      },
    },
    [
      {
        permissionName: 'plugins.classroom.classroom',
        actionNames: ['view'],
      },
    ]
  );
}

module.exports = addWelcome;
