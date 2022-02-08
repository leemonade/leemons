const { keyBy } = require('lodash');
const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getProfiles({ transacting } = {}) {
  const results = await table.configs.find(
    { key_$in: ['profile.teacher', 'profile.student'] },
    { transacting }
  );
  const byKey = keyBy(results, 'key');
  return {
    teacher: byKey['profile.teacher']?.value,
    student: byKey['profile.student']?.value,
  };
}

module.exports = { getProfiles };
