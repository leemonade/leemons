const _ = require('lodash');

/**
 * Return family members
 * @public
 * @static
 * @param {string} familyId - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getMembers({ familyId, ctx }) {
  const members = await ctx.tx.db.FamilyMembers.find({ family: familyId }).lean();
  const users = await ctx.tx.call('users.users.detail', { userId: _.map(members, 'user') });
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
