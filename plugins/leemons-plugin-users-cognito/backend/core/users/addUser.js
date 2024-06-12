const addUserToCognito = require('../aws/users/addUser');

/**
 *
 * @param {object} props
 * @param {string} props.userEmail
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 *
 */
async function addUser({ userEmail, ctx }) {
  const userPool = await ctx.tx.db.UserPool.findOne({});

  return addUserToCognito({
    userPoolId: userPool.userPool,
    userEmail,
    ctx,
  });
}

module.exports = addUser;
