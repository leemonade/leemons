// const { keyBy } = require('lodash'); // old
// const { table } = require('../tables'); // old

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function getProfiles({ ctx }) {
  const [teacher, student] = await Promise.all([
    ctx.tx.call('users.profiles.detailBySysName', { sysName: 'teacher' }),
    ctx.tx.call('users.profiles.detailBySysName', { sysName: 'student' }),
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
