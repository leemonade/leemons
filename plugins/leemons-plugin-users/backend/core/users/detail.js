const _ = require('lodash');
const { LeemonsError } = require('leemons-error');
const { getSuperAdminUserIds } = require('./getSuperAdminUserIds');

/**
 * Return the user for the id provided
 * @public
 * @static
 * @param {string|string[]} userId - User id
 * @return {Promise<User>}
 * */
async function detail({ userId, ctx }) {
  let users = await ctx.tx.db.Users.find({ id: _.isArray(userId) ? userId : [userId] }).lean();
  if (users.length !== (_.isArray(userId) ? userId : [userId]).length) {
    if (_.isArray(userId)) {
      throw new LeemonsError(ctx, { message: 'One of users not found for the ids provided' });
    } else {
      throw new LeemonsError(ctx, { message: 'No user found for the id provided' });
    }
  }

  const superAdminUsersIds = await getSuperAdminUserIds({ ctx });
  users = users.map((user) => ({ ...user, isSuperAdmin: superAdminUsersIds.includes(user.id) }));

  return _.isArray(userId) ? users : users[0];
}

module.exports = { detail };
