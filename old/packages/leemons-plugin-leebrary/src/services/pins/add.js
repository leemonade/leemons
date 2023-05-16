const { tables } = require('../tables');
const { exists: existsAsset } = require('../assets/exists');
const { getByAsset } = require('./getByAsset');

async function add(assetId, { userSession, transacting: t } = {}) {
  if (!assetId) {
    throw new global.utils.HttpError(400, 'Asset ID is required');
  }

  if (!(await existsAsset(assetId, { transacting: t }))) {
    throw new global.utils.HttpError(400, 'Asset does not exist');
  }

  const pin = await getByAsset(assetId, { userSession, transacting: t });

  if (pin?.id) {
    throw new global.utils.HttpError(400, 'Asset already pinned');
  }

  return global.utils.withTransaction(
    async (transacting) => {
      const result = await tables.pins.create(
        { asset: assetId, userAgent: userSession.userAgents[0].id },
        { transacting }
      );
      return result;
    },
    tables.pins,
    t
  );
}

module.exports = { add };
