const _ = require('lodash');
const { add: addRole } = require('../roles');
const { existName } = require('./existName');
const { table } = require('../tables');
const createNecessaryRolesForProfilesAccordingToCenters = require('./createNecessaryRolesForProfilesAccordingToCenters');

/**
 * Update the provided role
 * @public
 * @static
 * @param {ProfileAdd} data - Profile data
 * @param {RolePermissionsAdd} _permissions - Array of permissions
 * @param {any} _transacting - DB Transaction
 * @return {Promise<any>} Created permissions-roles
 * */
async function add({ name, description, permissions }, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const exist = await existName(name, undefined, { transacting });
      if (exist) throw new Error(`Already exists one profile with the name '${name}'`);

      let profile = await table.profiles.create(
        {
          name,
          description,
          uri: global.utils.slugify(name, { lower: true }),
        },
        { transacting }
      );

      const role = await leemons.plugin.services.roles.add(
        {
          name: `profile:${profile.id}:role`,
          type: leemons.plugin.prefixPN('profile-role'),
          permissions,
        },
        { transacting }
      );

      profile = await table.profiles.update({ id: profile.id }, { role: role.id }, { transacting });

      await createNecessaryRolesForProfilesAccordingToCenters(profile.id, undefined, {
        transacting,
      });

      return profile;
    },
    table.profiles,
    _transacting
  );
}

module.exports = { add };
