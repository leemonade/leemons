async function initRoles(centers) {
  const leemon = await leemons.getPlugin('users').services.roles.add({
    name: 'Estudiante Limones',
    description: 'Estudiante de los limones',
    type: leemons.plugin.prefixPN('profile'),
    permissions: [
      {
        permissionName: 'plugins.users.profiles',
        actionNames: ['view'],
      },
      { permissionName: 'plugins.users.user-data', actionNames: ['admin'] },
    ],
    center: centers.leemon.id,
  });
  const orange = await leemons.getPlugin('users').services.roles.add({
    name: 'Estudiante Naranjas',
    description: 'Estudiante de las naranjas',
    type: leemons.plugin.prefixPN('profile'),
    permissions: [{ permissionName: 'plugins.users.users', actionNames: ['view'] }],
    center: centers.orange.id,
  });
  return { leemon, orange };
}

module.exports = initRoles;
