const { permissions: table } = require('../tables');
const validateRole = require('./helpers/validateRole');
// const isAssetOwner = require('./helpers/isAssetOwner');

module.exports = async function set(asset, role, { userSession, transacting } = {}) {
  const userAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  try {
    // if (await isAssetOwner(asset, { userSession, transacting })) {
    //   return true;
    // }
    if (!validateRole(role)) {
      throw new Error('Invalid role');
    }

    await table.set(
      {
        asset,
        userAgent,
      },
      {
        role,
      },
      { transacting }
    );

    return true;
  } catch (e) {
    throw new Error(`Failed to set permissions: ${e.message}`);
  }
};
