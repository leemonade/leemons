const { permissions: table } = require('../tables');
// const isAssetOwner = require('./helpers/isAssetOwner');

module.exports = async function remove(asset, { userSession, transacting } = {}) {
  const userAgent =
    userSession.userAgents && userSession.userAgents.length ? userSession.userAgents[0].id : null;
  try {
    // if (await isAssetOwner(asset, { userSession, transacting })) {
    //   throw new Error("You can't remove permissions from the owner");
    // }

    return await table.deleteMany(
      {
        asset,
        userAgent,
      },
      { transacting }
    );
  } catch (e) {
    throw new Error(`Failed to delete permissions: ${e.message}`);
  }
};
