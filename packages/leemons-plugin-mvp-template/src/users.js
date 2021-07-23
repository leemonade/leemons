async function initUsers(roles) {
  const user1 = await leemons.plugins.users.services.users.add(
    {
      name: 'Jaime',
      email: 'jaime@leemons.io',
      password: 'testing',
      locale: 'es',
      active: true,
    },
    [roles.leemon.id, roles.orange.id]
  );
  return { users: [user1] };
}

module.exports = initUsers;
