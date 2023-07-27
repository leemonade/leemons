const { tables } = require('../tables');
const { getByAsset } = require('./getByAsset');

async function removeByAsset(assetId, { soft, userSession, transacting } = {}) {
  const pin = await getByAsset(assetId, { userSession, transacting });

  if (!pin) {
    throw new global.utils.HttpError(404, 'Pin not found');
  }

  try {
    const deleted = await tables.pins.delete({ id: pin.id }, { soft, transacting });

    return deleted;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to remove Pin: ${e.message}`);
  }
}

module.exports = { removeByAsset };
