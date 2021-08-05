const _ = require('lodash');

async function initUsers(centers, profiles) {
  const roles = await Promise.all([
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(
        profiles.student.id,
        centers.leemon.id
      ),
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(
        profiles.student.id,
        centers.orange.id
      ),
  ]);
  console.log('ROLES', roles);
  const user1 = await leemons.getPlugin('users').services.users.add(
    {
      name: 'Jaime',
      email: 'jaime@leemons.io',
      password: 'testing',
      locale: 'es',
      active: true,
    },
    _.map(roles, 'id')
  );
  console.log('USER', user1);
  return { users: [user1] };
}

module.exports = initUsers;
