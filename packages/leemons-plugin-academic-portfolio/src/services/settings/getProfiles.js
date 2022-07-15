const { keyBy } = require('lodash');
const { table } = require('../tables');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getProfiles({ transacting } = {}) {
  const d = leemons.getPlugin('users').services.profiles.detailBySysName;
  const [teacher, student] = await Promise.all([
    d('teacher', { transacting }),
    d('student', { transacting }),
  ]);
  return {
    teacher: teacher.id,
    student: student.id,
  };
  /*
  const results = await table.configs.find(
    { key_$in: ['profile.teacher', 'profile.student'] },
    { transacting }
  );
  const byKey = keyBy(results, 'key');
  return {
    teacher: byKey['profile.teacher']?.value,
    student: byKey['profile.student']?.value,
  };

   */
}

module.exports = { getProfiles };
