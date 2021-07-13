async function initUsers(profiles) {
  const user1 = await leemons.plugins.users.services.users.add(
    {
      name: 'Jaime',
      email: 'jaime@leemons.io',
      password: 'testing',
      language: 'es',
      active: true,
    },
    [profiles.student.id, profiles.teacher.id]
  );
  return { users: [user1] };
}

module.exports = initUsers;
