const { assets } = require('../../tables');

module.exports = async function isAssetOwner(asset, { userSession, transacting } = {}) {
  const userAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  try {
    console.log('asset', asset);
    const _asset = await assets.findOne(
      { id: asset },
      { columns: ['id', 'fromUserAgent'], transacting }
    );
    if (_asset) {
      if (_asset.fromUserAgent === userAgent) {
        return true;
      }
    }

    return false;
  } catch (e) {
    throw new Error(`Failed to determine if user is asset owner: ${e.message}`);
  }
};
