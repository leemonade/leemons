/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
const { keys, map, uniq, isEmpty } = require('lodash');
const Pool = require('async-promise-pool');
const importUsers = require('./bulk/users');

async function _addUser({ key, users, ctx }) {
  const { roles, ...item } = users[key];

  let itemRoles = await Promise.all(
    roles
      .filter((rol) => rol.center)
      .map((rol) =>
        ctx.call('users.profiles.getRoleForRelationshipProfileCenter', {
          profileId: rol.profile,
          centerId: rol.center,
        })
      )
  );

  if (isEmpty(itemRoles)) {
    itemRoles = roles.map((rol) => ({ id: rol.profileRole }));
  }

  ctx.logger.debug(`Adding user: ${item.name}`);
  const itemData = await ctx.call('users.users.add', {
    ...item,
    roles: map(itemRoles, 'id'),
    active: true,
  });
  ctx.logger.info(`User ADDED: ${item.name}`);

  const userProfiles = roles.map((rol) => rol.profileKey);

  users[key] = { ...itemData, profiles: uniq(userProfiles) };
}

async function initUsers({ file, centers, profiles, ctx }) {
  const pool = new Pool({ concurrency: 1 });
  try {
    const users = await importUsers(file, centers, profiles);
    const itemsKeys = keys(users);

    for (let i = 0, len = itemsKeys.length; i < len; i++) {
      const itemKey = itemsKeys[i];
      if (itemKey !== 'super') {
        pool.add(() => _addUser({ key: itemKey, users, ctx }));
      }
    }

    ctx.logger.debug('Batch processing users ...');
    await pool.all();
    ctx.logger.info('Users CREATED');

    return users;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initUsers;
