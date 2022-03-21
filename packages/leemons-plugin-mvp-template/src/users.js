/* eslint-disable no-await-in-loop */
const { keys, map, uniq } = require('lodash');
const importUsers = require('./bulk/users');

async function initUsers(centers, profiles) {
  const { services } = leemons.getPlugin('users');

  try {
    const users = await importUsers(centers, profiles);
    const itemsKeys = keys(users);

    // console.log('------ USERS ------');

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      const { roles, ...item } = users[itemKey];

      // console.log('user roles:', roles);

      const itemRoles = await Promise.all(
        roles.map((rol) =>
          services.profiles.getRoleForRelationshipProfileCenter(rol.profile, rol.center)
        )
      );

      // console.log('user roles created:', itemRoles);

      // console.log('Vamos a crear el usuario:');
      // console.dir({ ...item, active: true }, { depth: null });

      const itemData = await services.users.add({ ...item, active: true }, map(itemRoles, 'id'));
      const userProfiles = roles.map((rol) => rol.profileKey);

      users[itemKey] = { ...itemData, profiles: uniq(userProfiles) };
    }

    // console.log('tenemos los usuarios creados:');
    // console.dir(users, { depth: null });

    return users;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initUsers;
