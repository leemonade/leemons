const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function list({ page, size, profiles, centers, disabled, ctx, ...queries }) {
  const query = { ...queries };
  let roles = null;

  if (centers) {
    const centerRoles = await ctx.tx.db.RoleCenter.find({
      center: _.isArray(centers) ? centers : [centers],
    })
      .select(['id', 'role'])
      .lean();
    roles = _.map(centerRoles, 'role');
  }
  if (profiles) {
    const profileRoles = await ctx.tx.db.ProfileRole.find({
      profile: _.isArray(profiles) ? profiles : [profiles],
    })
      .select(['id', 'role'])
      .lean();
    if (_.isArray(roles)) {
      roles = _.intersection(roles, _.map(profileRoles, 'role'));
    } else {
      roles = _.map(profileRoles, 'role');
    }
  }

  let userAgents = null;
  if (_.isArray(roles) || _.isBoolean(disabled)) {
    const q = {};
    if (_.isArray(roles)) {
      q.role = roles;
    }
    if (_.isBoolean(disabled)) {
      if (disabled) {
        q.disabled = true;
      } else {
        q.$or = [{ disabled: null }, { disabled: false }];
      }
    }
    userAgents = await ctx.tx.db.UserAgent.find(q).select(['id', 'user', 'disabled']).lean();
    query.id = _.map(userAgents, 'user');
  }

  const result = await mongoDBPaginate({
    model: ctx.tx.db.Users,
    page,
    size,
    query,
  });
  result.userAgents = userAgents;

  if (userAgents) {
    const userAgentsByUser = _.keyBy(userAgents, 'user');
    const userAgentIds = _.map(result.items, (user) => userAgentsByUser[user.id].id);
    const tags = await ctx.tx.call('common.tags.getValuesTags', {
      type: 'users.user-agent',
      values: userAgentIds,
    });
    result.items = _.map(result.items, (user) => {
      const index = userAgentIds.indexOf(userAgentsByUser[user.id].id);
      return {
        ...user,
        tags: tags[index],
      };
    });
  }

  return result;
}

module.exports = { list };
