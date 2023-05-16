const { table } = require('../tables');

/**
 * Create new group if name and type not in use
 * @public
 * @static
 * @param {string} name - Group name
 *  @param {string} type - Group type
 * @return {Promise<Group>} Created group
 * */
async function addWithRole(
  { name, description, permissions, indexable },
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      let group = await table.groups.findOne(
        { $or: [{ name }, { uri: global.utils.slugify(name, { lower: true }) }], type: 'role' },
        { transacting }
      );
      if (group) throw new Error('There is already a group with this name and type');

      group = await table.groups.create(
        {
          name,
          type: 'role',
          description,
          uri: global.utils.slugify(name, { lower: true }),
          indexable,
        },
        { transacting }
      );

      const role = await leemons.plugin.services.roles.add(
        {
          name: `group:${group.id}:role`,
          type: leemons.plugin.prefixPN('group-role'),
          permissions,
        },
        { transacting }
      );

      await table.groupRole.create({ group: group.id, role: role.id }, { transacting });

      return group;
    },
    table.profiles,
    _transacting
  );
}

module.exports = { addWithRole };
