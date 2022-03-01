const _ = require('lodash');
const { table } = require('../tables');

async function list(page, size, { profiles, centers, ...queries } = {}, { transacting } = {}) {
  const query = { ...queries };
  let roles = null;

  if (centers) {
    const centerRoles = await table.roleCenter.find(
      { center_$in: _.isArray(centers) ? centers : [centers] },
      { columns: ['role'], transacting }
    );
    roles = _.map(centerRoles, 'role');
  }
  if (profiles) {
    const profileRoles = await table.profileRole.find(
      { profile_$in: _.isArray(profiles) ? profiles : [profiles] },
      { columns: ['role'], transacting }
    );
    if (_.isArray(roles)) {
      roles = _.intersection(roles, _.map(profileRoles, 'role'));
    } else {
      roles = _.map(profileRoles, 'role');
    }
  }

  if (_.isArray(roles)) {
    const userAgents = await table.userAgent.find(
      { role_$in: roles },
      { columns: ['user'], transacting }
    );
    query.id_$in = _.map(userAgents, 'user');
  }

  return global.utils.paginate(table.users, page, size, query, { transacting });
}

module.exports = { list };
