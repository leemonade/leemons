const add = require('./add');

async function addProfiles() {
  return add(
    {
      key: 'profile-list',
      order: 1,
      parentKey: 'users',
      url: '/private/users/profiles/list',
      label: {
        en: 'Profiles',
        es: 'Perfiles',
      },
    },
    [
      {
        permissionName: 'plugins.users.profiles',
        actionNames: ['view', 'admin'],
      },
    ]
  );
}

module.exports = addProfiles;
