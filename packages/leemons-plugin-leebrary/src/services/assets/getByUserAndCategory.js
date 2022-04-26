const { isEmpty, isArray } = require('lodash');
const { tables } = require('../tables');
const { getByIds: getAssets } = require('./getByIds');
const { getByCategory: getByPermissions } = require('../permissions/getByCategory');

async function getByUserAndCategory(
  categoryId,
  { details = false, includePublic = false, userSession, transacting } = {}
) {
  try {
    // Must include private and public assets
    const privateAssets = await getByPermissions(categoryId, { userSession, transacting });
    let publicAssets = [];

    if (includePublic) {
      publicAssets = await tables.assets.find(
        { category: categoryId, public: true },
        { columns: ['id'], transacting }
      );
    }

    const assets = privateAssets.concat(publicAssets).map((item) => item.id || item.asset);

    if (details) {
      return getAssets(assets, { transacting });
    }
    return assets;
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get category assets: ${e.message}`);
  }
}

module.exports = { getByCategory: getByUserAndCategory };
