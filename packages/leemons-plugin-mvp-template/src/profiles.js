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
  const guardian = await leemons.getPlugin('users').services.profiles.add({
    name: 'Guardian',
    description: 'Tutor legal de los alumnos vease un padre/madre',
    permissions: [],
  });
  return { student, guardian };
}

module.exports = initProfiles;
