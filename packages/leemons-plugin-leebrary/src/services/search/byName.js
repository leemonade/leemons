const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByIds: getAssetsByIds } = require('../assets/getByIds');

async function byName(
  name,
  { details = false, indexable = true, assets: assetsIds, transacting } = {}
) {
  try {
    const query = {
      name_$contains: name,
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
    throw new global.utils.HttpError(500, `Failed to find asset with name: ${e.message}`);
  }
}

module.exports = { byName };
