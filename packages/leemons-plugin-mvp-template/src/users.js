const { map } = require('lodash');

async function initUsers(centers, profiles) {
  const { centerA, centerB } = centers;
  const { admin, student, teacher, guardian } = profiles;

  // ·······························································
  // ROLES

  const adminRoles = await Promise.all([
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(admin.id, centerA.id),
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(admin.id, centerB.id),
  ]);

  const studentRoles = await Promise.all([
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(student.id, centerA.id),
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(student.id, centerB.id),
  ]);

  const teacherRoles = await Promise.all([
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(teacher.id, centerA.id),
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(teacher.id, centerB.id),
  ]);

  const guardianRoles = await Promise.all([
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(guardian.id, centerA.id),
  ]);

  // ·······························································
  // USERS

  const adminUser = await leemons.getPlugin('users').services.users.add(
    {
      name: 'Administrator',
      surname: 'Leemons',
      email: 'admin@leemons.io',
      password: 'testing',
      locale: 'en',
      active: true,
    },
    map(adminRoles, 'id')
  );

  const teacherUser = await leemons.getPlugin('users').services.users.add(
    {
      name: 'Will',
      surname: 'Teacher',
      email: 'teacher@leemons.io',
      password: 'testing',
      locale: 'en',
      active: true,
    },
    map(teacherRoles, 'id')
  );

  const studentUser = await leemons.getPlugin('users').services.users.add(
    {
      name: 'John',
      surname: 'Student',
      email: 'student@leemons.io',
      password: 'testing',
      locale: 'en',
      active: true,
    },
    map(studentRoles, 'id')
  );

  const guardianUser = await leemons.getPlugin('users').services.users.add(
    {
      name: 'Nicole',
      surname: 'Guardian',
      email: 'guardian@leemons.io',
      password: 'testing',
      locale: 'en',
      active: true,
    },
    map(guardianRoles, 'id')
  );

  // ·······························································
  // USER AGENTS

  await leemons
    .getPlugin('users')
    .services.users.addUserAgentContacts(
      map(adminUser.userAgents, 'id'),
      map(studentUser.userAgents, 'id'),
      map(teacherUser.userAgents, 'id'),
      map(guardianUser.userAgents, 'id')
    );

  return { admin: adminUser, student: studentUser, teacher: teacherUser, guardian: guardianUser };
}

module.exports = initUsers;
