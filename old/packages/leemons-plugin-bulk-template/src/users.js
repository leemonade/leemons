/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { keys, map, uniq, isEmpty } = require('lodash');
const Pool = require('async-promise-pool');
const importUsers = require('./bulk/users');

const pool = new Pool({ concurrency: 1 });

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

async function initUsers(file, centers, profiles) {
  try {
    const users = await importUsers(file, centers, profiles);
    const itemsKeys = keys(users);

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      if (itemKey !== 'super') {
        pool.add(() => _addUser(itemKey, users));
      }
    }

    leemons.log.debug('Batch processing users ...');
    await pool.all();
    leemons.log.info('Users CREATED');

    return users;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initUsers;
