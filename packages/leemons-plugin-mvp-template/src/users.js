/* eslint-disable no-await-in-loop */
const { keys, map, uniq, isEmpty } = require('lodash');
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

      let itemRoles = await Promise.all(
        roles
          .filter((rol) => rol.center)
          .map((rol) =>
            services.profiles.getRoleForRelationshipProfileCenter(rol.profile, rol.center)
          )
      );

      if (isEmpty(itemRoles)) {
        itemRoles = roles.map((rol) => ({ id: rol.profileRole }));
      }

      // console.log('user roles created:', itemRoles);

      // console.log('Vamos a crear el usuario:');
      // console.dir({ ...item, active: true }, { depth: null });
      leemons.log.debug(`Adding user: ${item.name}`);
      const itemData = await services.users.add({ ...item, active: true }, map(itemRoles, 'id'));
      leemons.log.info(`User ADDED: ${item.name}`);

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
