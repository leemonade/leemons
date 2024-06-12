const { updateUserPoolClient, deleteIdentityProvider } = require('../aws/userPool');

/**
 *
 * @param {string[]} savedData
 * @param {string[]} deletedItems
 * @returns {string[]}
 */
function excludeDeletedElements(savedData, deletedItems) {
  const providersMap = new Map(savedData.map((provider) => [provider.providerName, provider]));

  deletedItems.forEach((provider) => {
    if (providersMap.has(provider.providerName)) {
      providersMap.delete(provider.providerName);
    }
  });

  return Array.from(providersMap.values());
}

/**
 *
 * @param {object} props
 * @param {string[]} props.identityProviders
 * @param {import('@leemons/deployment-manager').Context} props.ctx
 */
async function deleteIdentityProviders({ identityProviders, ctx }) {
  const {
    userPool,
    clientID,
    identityProviders: savedProviders,
  } = await ctx.tx.db.UserPool.findOne({}).lean();

  const providersWithoutDelete = excludeDeletedElements(savedProviders, identityProviders);

  await updateUserPoolClient({
    userPoolId: userPool,
    clientId: clientID,
    identityProviders: providersWithoutDelete,
    ctx,
  });

  await Promise.all(
    providersWithoutDelete.map((provider) =>
      deleteIdentityProvider({
        userPoolId: userPool,
        identityProvider: provider,
        ctx,
      })
    )
  );

  await ctx.tx.db.UserPool.updateOne(
    { userPool },
    { $set: { identityProviders: providersWithoutDelete } }
  );

  return {
    userPool,
    clientID,
    identityProviders: providersWithoutDelete,
  };
}

module.exports = deleteIdentityProviders;
