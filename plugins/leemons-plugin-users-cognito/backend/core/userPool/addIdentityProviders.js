const { addIdentityProvider, updateUserPoolClient } = require('../aws/userPool');

/**
 *
 * @param {object} props
 * @param {import('../aws/userPool/identityProviders/addIdentityProvider').IdentityProvider[]} props.identityProviders
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function addIdentityProviders({ identityProviders, ctx }) {
  const {
    userPool,
    clientID,
    identityProviders: savedProviders,
  } = await ctx.tx.db.UserPool.findOne({}).lean();

  const promises = identityProviders
    .filter((provider) => !savedProviders.includes(provider.name))
    .map((provider) =>
      addIdentityProvider({
        userPoolId: userPool,
        identityProvider: provider,
        ctx,
      })
    );

  const newProvidersIds = await Promise.all(promises);

  if (!newProvidersIds.length) {
    return {
      userPool,
      clientID,
      identityProviders: savedProviders,
    };
  }

  const providersIds = Array.from(new Set([...newProvidersIds, ...savedProviders]));

  await updateUserPoolClient({
    userPoolId: userPool,
    clientId: clientID,
    identityProviders: providersIds,
    ctx,
  });

  await ctx.tx.db.UserPool.updateOne({ userPool }, { $set: { identityProviders: providersIds } });

  return {
    userPool,
    clientID,
    identityProviders: providersIds,
  };
}

module.exports = addIdentityProviders;
