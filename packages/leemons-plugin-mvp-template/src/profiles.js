async function initProfiles(roles) {
  const student = await leemons.getPlugin('users').services.profiles.add({
    name: 'Estudiante',
    description: 'Estudiante para login',
    roles: [roles.leemon.id, roles.orange.id],
  });
  return { student };
}

module.exports = initProfiles;
