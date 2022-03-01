const _ = require('lodash');
const { table } = require('../tables');

async function list(page, size, { profiles, ...queries } = {}, { transacting } = {}) {
  const query = { ...queries };
  if (profiles) {
    const userProfiles = await table.userProfile.find(
      { profile_$in: _.isArray(profiles) ? profiles : [profiles] },
      { columns: ['user'], transacting }
    );
    query.id_$in = userProfiles.map(({ user }) => user);
  }
  return global.utils.paginate(table.users, page, size, query, { transacting });
}

module.exports = { list };
