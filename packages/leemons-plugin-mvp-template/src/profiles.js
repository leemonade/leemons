async function initProfiles() {
  const student = await leemons.plugins.users.services.profiles.add({
    name: 'Students',
    description: 'Profile with the permissions a student should have',
    permissions: {
      'plugins.users.profiles': ['view'],
    },
  });
  const teacher = await leemons.plugins.users.services.profiles.add({
    name: 'Teacher',
    description: 'Profile with the permissions a teacher should have',
    permissions: {
      'plugins.users.users': ['view'],
    },
  });
  return { student, teacher };
}

module.exports = initProfiles;
