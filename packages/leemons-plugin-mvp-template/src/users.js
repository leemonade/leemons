/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { keys, map, uniq, isEmpty } = require('lodash');
const Pool = require('async-promise-pool');
const importUsers = require('./bulk/users');

const pool = new Pool({ concurrency: 5 });

async function _addUser(key, users) {
  const { services } = leemons.getPlugin('users');
  const { roles, ...item } = users[key];

  let itemRoles = await Promise.all(
    roles
      .filter((rol) => rol.center)
      .map((rol) => services.profiles.getRoleForRelationshipProfileCenter(rol.profile, rol.center))
  );

  if (isEmpty(itemRoles)) {
    itemRoles = roles.map((rol) => ({ id: rol.profileRole }));
  }

  leemons.log.debug(`Adding user: ${item.name}`);
  const itemData = await services.users.add({ ...item, active: true }, map(itemRoles, 'id'));
  leemons.log.info(`User ADDED: ${item.name}`);

  const userProfiles = roles.map((rol) => rol.profileKey);

  users[key] = { ...itemData, profiles: uniq(userProfiles) };
}

async function initUsers(centers, profiles) {
  try {
    const users = await importUsers(centers, profiles);
    const itemsKeys = keys(users);

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      pool.add(() => _addUser(itemKey, users));
    }

    console.log('Vamos a procesar los usuarios de 5 en 5...');
    await pool.all();
    console.log('Toma yaaaa!!!');

    return users;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initUsers;
