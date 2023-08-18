const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function list({ page, size, profiles, centers, ctx, ...queries }) {
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
    }).select(['id', 'role']);
    if (_.isArray(roles)) {
      roles = _.intersection(roles, _.map(profileRoles, 'role'));
    } else {
      roles = _.map(profileRoles, 'role');
    }
  }

  if (_.isArray(roles)) {
    const userAgents = await ctx.tx.db.UserAgent.find({ role: roles })
      .select(['id', 'user'])
      .lean();
    query.id = _.map(userAgents, 'user');
  }

  return mongoDBPaginate({
    model: ctx.tx.db.Users,
    page,
    size,
    query,
  });
}

module.exports = { list };
