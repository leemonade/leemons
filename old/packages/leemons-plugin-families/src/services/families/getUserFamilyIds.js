const _ = require('lodash');
const { table } = require('../tables');

async function getUserFamilyIds(user, { transacting } = {}) {
  const familyMembers = await table.familyMembers.find({ user }, { transacting });
  const familyIds = _.map(familyMembers, 'family');
  return _.uniq(familyIds);
}

module.exports = { getUserFamilyIds };
