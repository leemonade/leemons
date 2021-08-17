const add = require('./add');

async function addTree() {
  return add(
    {
      key: 'tree',
      order: 2,
      parentKey: 'classroom',
      url: '/classroom/private/tree',
      label: {
        en: 'Tree',
        es: 'Árbol',
      },
      disabled: true,
    },
    [
      {
        permissionName: 'plugins.classroom.classroom',
        actionNames: ['view'],
      },
    ]
  );
}

module.exports = addTree;
