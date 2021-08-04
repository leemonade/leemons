async function initProfiles() {
  const student = await leemons.getPlugin('users').services.profiles.add({
    name: 'Estudiante',
    description: 'Estudiante para login',
  });
  return { student };
}

module.exports = initProfiles;
