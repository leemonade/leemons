const { isEmpty } = require('lodash');
const { tables } = require('../tables');
const { getByIds } = require('./getByIds');

async function getByCategory(
  categoryId,
  { details = false, indexable = true, assets: assetIds, transacting } = {}
) {
  try {
    const query = {
      category: categoryId,
      indexable,
    };

    if (!isEmpty(assetIds)) {
      query.id_$in = assetIds;
    }

    const assets = await tables.assets.find(query, { transacting });

    if (details) {
      return getByIds(
        assets.map(({ id }) => id),
        { transacting }
      );
    }
    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get category assets: ${e.message}`);
  }
}

module.exports = { getByCategory };
