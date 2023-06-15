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
    _id: { $ne: data._id },
  }).lean();
  if (group) throw new Error('There is already a group with this name and type');

  const [_group, groupUserAgents] = await Promise.all([
    ctx.tx.db.Groups.findByIdAndUpdate(
      data._id,
      {
        name: data.name,
        description: data.description,
        uri: slugify(data.name, { lower: true }),
      },
      { new: true }
    ),
    ctx.tx.db.GroupUserAgent.find({ group: data._id }).select(['userAgent']).lean(),
    markAllUsersInGroupToReloadPermissions({ groupId: data._id, ctx }),
  ]);
  group = _group;

  const groupRole = (await ctx.tx.db.GroupRole.find({ group: group._id }).lean())[0];

  // Formato: data.permissions
  // [{ permissionName, actionNames }]
  await ctx.tx.call('users.roles.update', {
    _id: groupRole.role,
    name: `group:${group._id.toString()}:role`,
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
        group: data._id,
        userAgent: userAgentIdsToRemove,
      });
    }
    if (userAgentIdsToAdd?.length) {
      userAgentsToReloadPermissions.push(...userAgentIdsToAdd);

      for (let i = 0, l = userAgentIdsToAdd.length; i < l; i++) {
        await checkIfCanCreateUserAgentInGroup({
          userAgentId: userAgentIdsToAdd[i],
          groupId: data._id,
          ctx,
        });
        await ctx.tx.db.GroupUserAgent.create({ group: data._id, userAgent: userAgentIdsToAdd[i] });
      }
    }
    if (userAgentsToReloadPermissions?.length) {
      await ctx.tx.db.UserAgent.updateMany(
        { _id: userAgentsToReloadPermissions },
        { reloadPermissions: true }
      );
    }
  }

  return group;
}

module.exports = { updateWithRole };
