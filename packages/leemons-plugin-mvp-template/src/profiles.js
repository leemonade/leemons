async function initProfiles() {
  const student = await leemons.getPlugin('users').services.profiles.add({
    name: 'Estudiante',
    description: 'Estudiante para login',
    permissions: [
      {
        permissionName: 'plugins.users.profiles',
        actionNames: ['view', 'admin'],
      },
      { permissionName: 'plugins.users.user-data', actionNames: ['admin'] },
      { permissionName: 'plugins.users.users', actionNames: ['view'] },
    ],
  });
  return { student };
}

module.exports = initProfiles;
