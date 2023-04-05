const { table } = require('../tables');
const {
  markAllUsersInGroupToReloadPermissions,
} = require('./markAllUsersInGroupToReloadPermissions');

/**
 * Create new group if name and type not in use
 * @public
 * @static
 * @param {string} name - Group name
 *  @param {string} type - Group type
 * @return {Promise<Group>} Created group
 * */
async function updateWithRole(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      let group = await table.groups.findOne(
        {
          $or: [{ name: data.name }, { uri: global.utils.slugify(data.name, { lower: true }) }],
          type: 'role',
          id_$ne: data.id,
        },
        { transacting }
      );
      if (group) throw new Error('There is already a group with this name and type');

      [group] = await Promise.all([
        table.groups.update(
          { id: data.id },
          {
            name: data.name,
            description: data.description,
            uri: global.utils.slugify(data.name, { lower: true }),
          },
          { transacting }
        ),
        markAllUsersInGroupToReloadPermissions(data.id, { transacting }),
      ]);

      const groupRole = (await table.groupRole.find({ group: group.id }, { transacting }))[0];

      // Formato: data.permissions
      // [{ permissionName, actionNames }]
      await leemons.plugin.services.roles.update(
        {
          id: groupRole.id,
          name: `group:${group.id}:role`,
          type: leemons.plugin.prefixPN('group-role'),
          permissions: data.permissions,
        },
        { transacting }
      );

      return group;
    },
    table.profiles,
    _transacting
  );
}

module.exports = { updateWithRole };
