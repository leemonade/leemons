const { table } = require('../tables');
const { exist } = require('./exist');

/**
 * Add new user profile
 * @public
 * @static
 * @param {string} user - User id
 * @param {string} profile - Profile id
 * @param {any} _transacting - DB transaction
 * @return {Promise<boolean>}
 * */
async function add(user, profile, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      if (await exist(user, profile, { transacting }))
        throw new Error('The user profile already exists');

      let userProfile = await table.userProfile.create(
        {
          user,
          profile,
        },
        { transacting }
      );

      const role = await leemons.plugin.services.roles.add(
        {
          name: `user-profile:${userProfile.id}:role`,
          type: leemons.plugin.prefixPN('user-profile-role'),
          permissions: [],
        },
        { transacting }
      );

      return await table.userProfile.update(
        { id: userProfile.id },
        { role: role.id },
        { transacting }
      );
    },
    table.userProfile,
    _transacting
  );
}

module.exports = { add };
