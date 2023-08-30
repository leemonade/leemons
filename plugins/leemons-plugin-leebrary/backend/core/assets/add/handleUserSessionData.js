/**
 * Handles the user session data.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.assetData - The data of the asset.
 * @param {Object} params.userSession - The user session.
 * @returns {Object} The handled asset data.
 */
function handleUserSessionData({ assetData, userSession, ctx }) {
  if (!Object.keys(userSession).length) ctx.logger.warn("Empty userSession passed to handleUserSessionData");
  assetData.fromUser = userSession.id;
  assetData.fromUserAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  return assetData;
}

module.exports = { handleUserSessionData };
