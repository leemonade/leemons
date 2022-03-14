const { getByIds: getAssetsByIds } = require('../assets/getByIds');
const { tables } = require('../tables');

async function byDescription(
  description,
  { details = false, assets: assetsIds, transacting } = {}
) {
  try {
    const query = {
      description_$contains: description,
    };

    if (assetsIds) {
      query.id_$in = assetsIds;
    }

    let assets = await tables.assets.find(query, { columns: ['id'], transacting });
    assets = assets.map((entry) => entry.id);

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }
    return assets;
  } catch (e) {
    throw new Error(`Failed to find asset with description: ${e.message}`);
  }
}

module.exports = { byDescription };
