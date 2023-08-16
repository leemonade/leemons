const _ = require('lodash');
const { table } = require('../tables');

/**
 * Return family members
 * @public
 * @static
 * @param {string} familyId - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getMembers(familyId, { transacting } = {}) {
  const members = await table.familyMembers.find({ family: familyId }, { transacting });
  const users = await leemons
    .getPlugin('users')
    .services.users.detail(_.map(members, 'user'), { transacting });
  const usersById = _.keyBy(users, 'id');
  const guardians = [];
  const students = [];
  _.forEach(members, ({ user, memberType, family, ...rest }) => {
    if (memberType === 'student') {
      students.push({
        ...rest,
        ...usersById[user],
        memberType,
      });
    } else {
      guardians.push({
        ...rest,
        ...usersById[user],
        memberType,
      });
    }
  });

  return { guardians, students };
}

module.exports = { getMembers };
