const { isEmpty } = require('lodash');
const { getByIds: getAssetsByIds } = require('../assets/getByIds');
const { tables } = require('../tables');

async function byDescription(
  description,
  { details = false, indexable = true, assets: assetsIds, transacting } = {}
) {
  try {
    const query = {
      description_$contains: description,
      indexable,
    };

    if (!isEmpty(assetsIds)) {
      query.id_$in = assetsIds;
    }

    let assets = await tables.assets.find(query, { columns: ['id'], transacting });
    assets = assets.map((entry) => entry.id);

    if (details) {
      return getAssetsByIds(assets, { transacting });
    }
    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to find asset with description: ${e.message}`);
  }
}

module.exports = { byDescription };
