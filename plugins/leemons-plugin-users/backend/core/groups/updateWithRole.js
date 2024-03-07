/* eslint-disable no-await-in-loop */
const _ = require('lodash');
const slugify = require('slugify');
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
async function updateWithRole({ ctx, ...data }) {
  let group = await ctx.tx.db.Groups.findOne({
    $or: [{ name: data.name }, { uri: slugify(data.name, { lower: true }) }],
    type: 'role',
    id: { $ne: data.id },
  }).lean();
  if (group) throw new Error('There is already a group with this name and type');

  const [_group, groupUserAgents] = await Promise.all([
    ctx.tx.db.Groups.findByIdAndUpdate(
      data.id,
      {
        name: data.name,
        description: data.description,
        uri: slugify(data.name, { lower: true }),
      },
      { new: true }
    ),
    ctx.tx.db.GroupUserAgent.find({ group: data.id }).select(['userAgent']).lean(),
    markAllUsersInGroupToReloadPermissions({ groupId: data.id, ctx }),
  ]);
  group = _group;

  const groupRole = (await ctx.tx.db.GroupRole.find({ group: group.id }).lean())[0];

  // Formato: data.permissions
  // [{ permissionName, actionNames }]
  await ctx.tx.call('users.roles.update', {
    id: groupRole.role,
    name: `group:${group.id.toString()}:role`,
    type: ctx.prefixPN('group-role'),
    permissions: data.permissions,
  });

  if (_.isArray(data.userAgents)) {
    const groupUserAgentIds = _.map(groupUserAgents, 'userAgent');
    const userAgentIdsToRemove = _.without(groupUserAgentIds, ...data.userAgents);
    const userAgentIdsToAdd = _.without(data.userAgents, ...groupUserAgentIds);
    const userAgentsToReloadPermissions = [];

    if (userAgentIdsToRemove?.length) {
      userAgentsToReloadPermissions.push(...userAgentIdsToRemove);
      await ctx.tx.db.GroupUserAgent.deleteMany({
        group: data.id,
        userAgent: userAgentIdsToRemove,
      });
    }
    if (userAgentIdsToAdd?.length) {
      userAgentsToReloadPermissions.push(...userAgentIdsToAdd);

      for (let i = 0, l = userAgentIdsToAdd.length; i < l; i++) {
        await checkIfCanCreateUserAgentInGroup({
          userAgentId: userAgentIdsToAdd[i],
          groupId: data.id,
          ctx,
        });
        await ctx.tx.db.GroupUserAgent.create({ group: data.id, userAgent: userAgentIdsToAdd[i] });
      }
    }
    if (userAgentsToReloadPermissions?.length) {
      await ctx.tx.db.UserAgent.updateMany(
        { id: userAgentsToReloadPermissions },
        { reloadPermissions: true }
      );
    }
  }

  return group;
}

module.exports = { updateWithRole };
