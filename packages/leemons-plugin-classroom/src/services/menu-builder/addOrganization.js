const add = require('./add');

async function addOrganization() {
  return add(
    {
      key: 'organization',
      order: 3,
      parentKey: 'classroom',
      url: '/classroom/private/organization',
      label: {
        en: 'Organization',
        es: 'Organización',
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

module.exports = addOrganization;
