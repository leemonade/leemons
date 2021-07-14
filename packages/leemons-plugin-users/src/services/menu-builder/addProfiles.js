const add = require('./add');

async function addProfiles() {
  return add(
    {
      key: 'profile-list',
      parentKey: 'users',
      url: '/users/private/profiles/list',
      label: {
        en: 'Profiles',
        es: 'Perfiles',
      },
    },
    [
      {
        permissionName: 'plugins.users.profiles',
        actionNames: ['view'],
      },
    ]
  );
}

module.exports = addProfiles;
