const add = require('./add');

async function addFamiliesData() {
  return add(
    {
      key: 'families-data',
      parentKey: 'plugins.users.users',
      url: '/families/private/config',
      label: {
        en: 'Families setup',
        es: 'Configuración de las familias',
      },
    },
    [
      {
        permissionName: 'plugins.families.config',
        actionNames: ['view', 'admin'],
      },
    ]
  );
}

module.exports = { addFamiliesData };
