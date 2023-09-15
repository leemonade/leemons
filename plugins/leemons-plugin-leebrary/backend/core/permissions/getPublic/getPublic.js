const { LeemonsError } = require('@leemons/error');
const getRolePermissions = require('../helpers/getRolePermissions');
const { find: findAsset } = require('../../assets/find');

async function getPublic({ categoryId, indexable = true, ctx }) {
  try {
    const query = { public: true, indexable };

    if (categoryId) {
      query.category = categoryId;
    }

    const publicAssets = await findAsset({ query, ctx });

    return publicAssets.map((asset) => ({
      asset: asset.id,
      role: 'public',
      permissions: getRolePermissions({ role: 'public', ctx }),
    }));
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Failed to get permissions: ${e.message}`,
      httpStatusCode: 500,
    });
  }
}

module.exports = { getPublic };
