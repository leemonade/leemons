/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const { table } = require('../tables');
const {
  markAllUsersInGroupToReloadPermissions,
} = require('./markAllUsersInGroupToReloadPermissions');
const { checkIfCanCreateUserAgentInGroup } = require('./checkIfCanCreateNUserAgentsInGroup');

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

      const [_group, groupUserAgents] = await Promise.all([
        table.groups.update(
          { id: data.id },
          {
            name: data.name,
            description: data.description,
            uri: global.utils.slugify(data.name, { lower: true }),
          },
          { transacting }
        ),
        table.groupUserAgent.find({ group: data.id }, { columns: ['userAgent'], transacting }),
        markAllUsersInGroupToReloadPermissions(data.id, { transacting }),
      ]);
      group = _group;

      const groupRole = (await table.groupRole.find({ group: group.id }, { transacting }))[0];

      // Formato: data.permissions
      // [{ permissionName, actionNames }]
      await leemons.plugin.services.roles.update(
        {
          id: groupRole.role,
          name: `group:${group.id}:role`,
          type: leemons.plugin.prefixPN('group-role'),
          permissions: data.permissions,
        },
        { transacting }
      );

      if (_.isArray(data.userAgents)) {
        const groupUserAgentIds = _.map(groupUserAgents, 'userAgent');
        const userAgentIdsToRemove = _.without(groupUserAgentIds, ...data.userAgents);
        const userAgentIdsToAdd = _.without(data.userAgents, ...groupUserAgentIds);
        const userAgentsToReloadPermissions = [];

        if (userAgentIdsToRemove?.length) {
          userAgentsToReloadPermissions.push(...userAgentIdsToRemove);
          await table.groupUserAgent.deleteMany(
            {
              group: data.id,
              userAgent_$in: userAgentIdsToRemove,
            },
            { transacting }
          );
        }
        if (userAgentIdsToAdd?.length) {
          userAgentsToReloadPermissions.push(...userAgentIdsToAdd);

          for (let i = 0, l = userAgentIdsToAdd.length; i < l; i++) {
            await checkIfCanCreateUserAgentInGroup(userAgentIdsToAdd[i], data.id, { transacting });
            await table.groupUserAgent.create(
              { group: data.id, userAgent: userAgentIdsToAdd[i] },
              { transacting }
            );
          }
        }
        if (userAgentsToReloadPermissions?.length) {
          await table.userAgent.updateMany(
            { id_$in: userAgentsToReloadPermissions },
            { reloadPermissions: true },
            { transacting }
          );
        }
      }

      return group;
    },
    table.profiles,
    _transacting
  );
}

module.exports = { updateWithRole };
