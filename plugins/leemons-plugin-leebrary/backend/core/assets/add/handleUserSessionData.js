/**
 * Handles the user session data and logs warnings if necessary.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.assetData - The data of the asset.
 * @param {Object} params.userSession - The user session.
 * @param {MoleculerContext} params.ctx Moleculer context
 * @returns {Object} The handled asset data.
 */
function handleUserSessionData({ assetData, ctx }) {
  const { userSession } = ctx.meta;
  if (!Object.keys(userSession).length)
    ctx.logger.warn('Empty userSession passed to handleUserSessionData');
  assetData.fromUser = userSession.id;
  assetData.fromUserAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  return assetData;
}

module.exports = { handleUserSessionData };
