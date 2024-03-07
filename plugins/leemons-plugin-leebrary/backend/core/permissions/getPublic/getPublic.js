/**
 * Fetches public assets based on the provided category ID and indexability.
 * @param {Object} params - Function parameters.
 * @param {string} params.categoryId - The ID of the category to filter by.
 * @param {boolean} [params.indexable=true] - Whether the assets should be indexable.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} An array of public assets with their respective roles and permissions.
 * @throws {LeemonsError} When the asset fetching fails.
 */
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
