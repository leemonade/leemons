const _ = require('lodash');
const { add: addRole } = require('../roles');
const { existName } = require('./existName');
const { table } = require('../tables');

/**
 * Update the provided role
 * @public
 * @static
 * @param {ProfileAdd} data - Profile data
 * @param {RolePermissionsAdd} _permissions - Array of permissions
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function add({ name, description, roles }, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const exist = await existName(name, undefined, { transacting });
      if (exist) throw new Error(`Already exists one profile with the name '${name}'`);

      const role = await table.roles.create(
        {
          name: `profile:${name}:role`,
          type: leemons.plugin.prefixPN('profile-role'),
          uri: global.utils.slugify(name, { lower: true }),
        },
        { transacting }
      );

      const profile = await table.profiles.create(
        {
          name,
          description,
          uri: global.utils.slugify(name, { lower: true }),
          role: role.id,
        },
        { transacting }
      );

      if (roles) {
        await Promise.all(
          _.map(roles, (role) => {
            return table.profileRole.create(
              {
                profile: profile.id,
                role: role,
              },
              { transacting }
            );
          })
        );
      }
      return profile;
    },
    table.profiles,
    _transacting
  );
}

module.exports = { add };
