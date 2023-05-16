const getRolePermissions = require('./helpers/getRolePermissions');
const { find: findAsset } = require('../assets/find');

async function getPublic(categoryId, { indexable = true, transacting } = {}) {
  try {
    const query = { public: true, indexable };

    if (categoryId) {
      query.category = categoryId;
    }

    const publicAssets = await findAsset(query, { transacting });

    return publicAssets.map((asset) => ({
      asset: asset.id,
      role: 'public',
      permissions: getRolePermissions('public'),
    }));
  } catch (e) {
    throw new global.utils.HttpError(500, `Failed to get permissions: ${e.message}`);
  }
}

module.exports = { getPublic };
