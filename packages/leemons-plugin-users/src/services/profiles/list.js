const _ = require('lodash');
const { table } = require('../tables');

async function list(page, size, { withRoles, transacting } = {}) {
  const results = await global.utils.paginate(table.profiles, page, size, undefined, {
    transacting,
  });
  if (withRoles) {
    const profileRoles = await table.profileRole.find(
      { profile_$in: _.map(results.items, 'id') },
      { transacting }
    );
    const options = { transacting };
    if (_.isObject(withRoles)) options.columns = withRoles.columns;
    const roles = await table.roles.find({ id_$in: _.map(profileRoles, 'role') }, options);
    const profileRoleByProfile = _.groupBy(profileRoles, 'profile');
    const rolesById = _.keyBy(roles, 'id');
    _.forEach(results.items, (profile) => {
      profile.roles = [];
      if (profileRoleByProfile[profile.id]) {
        _.forEach(profileRoleByProfile[profile.id], ({ role }) => {
          profile.roles.push(rolesById[role]);
        });
      }
    });
  }
  return results;
}

module.exports = { list };
