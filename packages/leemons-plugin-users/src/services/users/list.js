const _ = require('lodash');
const { table } = require('../tables');

async function list(
  page,
  size,
  { profiles, centers, disabled, ...queries } = {},
  { transacting } = {}
) {
  const query = { ...queries };
  let roles = null;

  if (centers) {
    const centerRoles = await table.roleCenter.find(
      { center_$in: _.isArray(centers) ? centers : [centers] },
      { columns: ['id', 'role'], transacting }
    );
    roles = _.map(centerRoles, 'role');
  }
  if (profiles) {
    const profileRoles = await table.profileRole.find(
      { profile_$in: _.isArray(profiles) ? profiles : [profiles] },
      { columns: ['id', 'role'], transacting }
    );
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
      q.role_$in = roles;
    }
    if (_.isBoolean(disabled)) {
      if (disabled) {
        q.disabled = true;
      } else {
        q.$or = [{ disabled_$null: true }, { disabled: false }];
      }
    }
    userAgents = await table.userAgent.find(q, {
      columns: ['id', 'user', 'disabled'],
      transacting,
    });
    query.id_$in = _.map(userAgents, 'user');
  }

  const result = await global.utils.paginate(table.users, page, size, query, { transacting });
  result.userAgents = userAgents;

  if (userAgents) {
    const userAgentsByUser = _.keyBy(userAgents, 'user');
    const userAgentIds = _.map(result.items, (user) => userAgentsByUser[user.id].id);
    const tagsService = leemons.getPlugin('common').services.tags;
    const tags = await tagsService.getValuesTags(userAgentIds, {
      type: 'plugins.users.user-agent',
      transacting,
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
