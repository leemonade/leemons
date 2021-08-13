const add = require('./add');

async function addClasses() {
  return add(
    {
      key: 'classes',
      order: 4,
      parentKey: 'classroom',
      url: '/classroom/private/classes',
      label: {
        en: 'Classes admin',
        es: 'Clases admin',
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

module.exports = addClasses;
