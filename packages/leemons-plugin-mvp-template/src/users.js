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
  const roles2 = await Promise.all([
    leemons
      .getPlugin('users')
      .services.profiles.getRoleForRelationshipProfileCenter(
        profiles.guardian.id,
        centers.leemon.id
      ),
  ]);

  const user1 = await leemons.getPlugin('users').services.users.add(
    {
      name: 'Jaime',
      email: 'jaime@leemons.io',
      password: 'testing',
      locale: 'es',
      active: true,
    },
    _.map(roles, 'id').concat(_.map(roles2, 'id'))
  );
  const user2 = await leemons.getPlugin('users').services.users.add(
    {
      name: 'Jaime Guardian',
      email: 'jaime2@leemons.io',
      password: 'testing',
      locale: 'en',
      active: true,
    },
    _.map(roles2, 'id')
  );

  return [user1, user2];
}

module.exports = initUsers;
