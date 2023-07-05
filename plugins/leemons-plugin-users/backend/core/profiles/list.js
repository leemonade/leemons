const _ = require('lodash');
const { mongoDBPaginate } = require('leemons-mongodb-helpers');

async function list({ page, size, withRoles, indexable = true, ctx }) {
  const query = { indexable };
  if (indexable === 'all') delete query.indexable;

  const results = await mongoDBPaginate({ model: ctx.tx.db.Profiles, page, size, query });

  if (withRoles) {
    const profileRoles = await ctx.tx.db.ProfileRole.find({
      profile: _.map(results.items, 'id'),
    }).lean();
    const rquery = ctx.tx.db.Roles.find({ id: _.map(profileRoles, 'role') });
    if (_.isObject(withRoles)) rquery.select(withRoles.columns);
    const roles = await rquery.lean().exec();
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
