const { updateIdentityProvider } = require('../aws/userPool');

/**
 *
 * @param {object} props
 * @param {object[]} props.identityProviders
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function updateIdentityProviders({ identityProviders, ctx }) {
  const {
    userPool,
    clientID,
    identityProviders: savedProviders,
  } = await ctx.tx.db.UserPool.findOne({}).lean();

  const promises = identityProviders.map((provider) =>
    updateIdentityProvider({
      userPoolId: userPool,
      identityProvider: provider,
      ctx,
    })
  );

  await Promise.all(promises);

  return {
    userPool,
    clientID,
    identityProviders: savedProviders,
  };
}

module.exports = updateIdentityProviders;
