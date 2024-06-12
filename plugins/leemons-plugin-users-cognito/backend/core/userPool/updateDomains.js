const { updateUserPoolClient } = require('../aws/userPool');

/**
 *
 * @param {object} props
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function updateDomains({ ctx }) {
  const { userPool, clientID, identityProviders } = await ctx.tx.db.UserPool.findOne({}).lean();

  await updateUserPoolClient({
    userPoolId: userPool,
    clientId: clientID,
    identityProviders,
    ctx,
  });

  return {
    userPool,
    clientID,
    identityProviders,
  };
}

module.exports = updateDomains;
