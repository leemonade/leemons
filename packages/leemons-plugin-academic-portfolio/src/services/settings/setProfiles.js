const { keyBy } = require('lodash');
const { table } = require('../tables');
const { getProfiles } = require('./getProfiles');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function setProfiles({ teacher, student }, { transacting } = {}) {
  await Promise.all([
    table.configs.set(
      {
        key: 'profile.teacher',
      },
      {
        key: 'profile.teacher',
        value: teacher,
      },
      { transacting }
    ),
    table.configs.set(
      {
        key: 'profile.student',
      },
      {
        key: 'profile.student',
        value: student,
      },
      { transacting }
    ),
  ]);
  return getProfiles({ transacting });
}

module.exports = { setProfiles };
