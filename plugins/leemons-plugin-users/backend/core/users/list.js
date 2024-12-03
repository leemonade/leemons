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

async function list({
  page,
  size,
  profiles,
  centers,
  disabled,
  ctx,
  sort,
  collation,
  listUserAgents,
  includeUserDataset,
  includeUserAgentsDataset,
  ...queries
}) {
  const query = Object.fromEntries(
    Object.entries(queries)
      .filter(([prop]) =>
        ['id', 'name', 'surnames', 'secondSurname', 'email', 'phone', 'search'].includes(prop)
      )
      .map(([prop, value]) => {
        if (prop === 'search') {
          const searchValue = { $regex: _.escapeRegExp(value.toLowerCase()), $options: 'i' };
          return [
            '$or',
            [
              { name: searchValue },
              { surnames: searchValue },
              { secondSurname: searchValue },
              { email: searchValue },
              { phone: searchValue },
            ],
          ];
        }
        return [prop, { $regex: value, $options: 'i' }];
      })
  );

  let roles = null;

  if (centers) {
    roles = await queryCenterRoles({ centers, ctx });
  }

  if (profiles) {
    const profileRoles = await queryProfileRoles({ profiles, excludeProfiles: [], ctx });
    if (_.isArray(roles)) {
      roles = _.intersection(roles, _.map(profileRoles, 'role'));
    } else {
      roles = _.map(profileRoles, 'role');
    }
  }

  let userAgents = null;
  if (_.isArray(roles) || _.isBoolean(disabled) || listUserAgents) {
    userAgents = await queryUserAgents({ roles, disabled, ctx });
    query.id = _.map(userAgents, 'user');
  }

  const result = await mongoDBPaginate({
    model: ctx.tx.db.Users,
    page,
    size,
    sort,
    collation,
    query,
  });

  result.userAgents = userAgents;

  if (userAgents) {
    const userAgentsByUser = _.keyBy(userAgents, 'user');
    const userAgentIds = _.map(result.items, (user) => userAgentsByUser[user.id].id);
    let connections = [];

    const [tags, hasAdminPermission] = await Promise.all([
      ctx.tx.call('common.tags.getValuesTags', {
        type: 'users.user-agent',
        values: userAgentIds,
      }),
      // Check if the user has the "admin" permission and if so, add the "last connection" field
      ctx.tx.call('users.auth.hasPermissionCTX', {
        allowedPermissions: {
          'users.users': {
            actions: ['admin'],
          },
        },
      }),
    ]);

    if (hasAdminPermission) {
      connections = await ctx.tx.call('xapi.xapi.aggregate', {
        pipeline: [
          {
            $match: {
              type: 'log',
              'statement.actor.account.name': { $in: userAgentIds },
              'statement.object.id': { $regex: /^.*\/api\/view\/program$/ },
            },
          },
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: '$statement.actor.account.name',
              latestLog: { $first: '$$ROOT' },
            },
          },
          { $replaceRoot: { newRoot: '$latestLog' } },
        ],
      });
    }

    result.items = _.map(result.items, (user) => {
      const index = userAgentIds.indexOf(userAgentsByUser[user.id].id);
      const lastConnection = connections.find((c) => {
        const userAgent = userAgentsByUser[user.id];
        return c?.statement?.actor?.account?.name === userAgent.id;
      });
      return {
        ...user,
        tags: tags[index],
        lastConnection: lastConnection?.statement?.timestamp,
      };
    });
  }

  if (includeUserDataset) {
    const userIds = result.items.map((user) => user.id);
    const userAgents = ctx.meta.userSession?.userAgents;
    const [userAgent] = userAgents ?? [];

    // Get dataset values
    const userDatasetsValues = await Promise.allSettled(
      userIds.map((userId) =>
        ctx.call('dataset.dataset.getValues', {
          locationName: 'user-data',
          pluginName: 'users',
          target: userId,
          userAgent,
        })
      )
    );

    result.items = result.items.map((user) => {
      const index = userIds.indexOf(user.id);
      let dataset = null;
      if (userDatasetsValues[index].status === 'fulfilled') {
        dataset = userDatasetsValues[index].value;
      }

      return {
        ...user,
        dataset,
      };
    });
  }

  return result;
}

module.exports = { list };
