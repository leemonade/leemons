const { mongoDBPaginate } = require('@leemons/mongodb-helpers');
const _ = require('lodash');

async function queryCenterRoles({ centers, ctx }) {
  const query = {};

  if (centers) {
    query.center = _.isArray(centers) ? centers : [centers];
  }

  const centerRoles = await ctx.tx.db.RoleCenter.find(query).select(['id', 'role']).lean();
  let roles = _.map(centerRoles, 'role');

  // Remove the admin profile from the list if the deployment is not advanced or enterprise
  const deployment = await ctx.tx.call('deployment-manager.getDeployment');
  if (!['basic', 'advanced', 'enterprise'].includes(deployment.type)) {
    const adminProfiles = await ctx.tx.db.Profiles.find({ sysName: ['admin', 'super'] })
      .select(['id'])
      .lean();
    const adminProfilesRoles = await ctx.tx.db.ProfileRole.find({
      profile: _.map(adminProfiles, 'id'),
    })
      .select(['id', 'role'])
      .lean();
    const adminRoles = _.map(adminProfilesRoles, 'role');
    roles = _.filter(roles, (role) => !adminRoles.includes(role));
  }

  return roles;
}

async function queryProfileRoles({ profiles, excludeProfiles, ctx }) {
  const queryProfiles = (_.isArray(profiles) ? profiles : [profiles]).filter(
    (profile) => !excludeProfiles.includes(profile)
  );
  return ctx.tx.db.ProfileRole.find({
    profile: queryProfiles,
  })
    .select(['id', 'role'])
    .lean();
}

async function queryUserAgents({ roles, disabled, ctx }) {
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
  const userAgents = await ctx.tx.db.UserAgent.find(q)
    .select(['id', 'user', 'role', 'disabled'])
    .lean();

  const profilesByUserAgents = await ctx.tx.db.ProfileRole.find({
    role: _.map(userAgents, 'role'),
  })
    .select(['id', 'profile', 'role'])
    .lean();

  return _.map(userAgents, (userAgent) => ({
    ...userAgent,
    profile: _.find(profilesByUserAgents, { role: userAgent.role })?.profile,
  }));
}

async function list({ page, size, profiles, centers, disabled, ctx, sort, ...queries }) {
  const query = { ...queries };
  let roles = await queryCenterRoles({ centers, ctx });

  if (profiles) {
    const profileRoles = await queryProfileRoles({ profiles, excludeProfiles: [], ctx });
    if (_.isArray(roles)) {
      roles = _.intersection(roles, _.map(profileRoles, 'role'));
    } else {
      roles = _.map(profileRoles, 'role');
    }
  }

  let userAgents = null;
  if (_.isArray(roles) || _.isBoolean(disabled)) {
    userAgents = await queryUserAgents({ roles, disabled, ctx });
    query.id = _.map(userAgents, 'user');
  }

  const result = await mongoDBPaginate({
    model: ctx.tx.db.Users,
    page,
    size,
    sort,
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
