const { uniqBy, find, groupBy, map } = require('lodash');
const semver = require('semver');

/**
 * Filters assets by publish status.
 *
 * @param {Object} params - The parameters object.
 * @param {Array} params.assets - The assets to be filtered.
 * @param {Array} params.assetsWithPermissions - The assets with permissions.
 * @param {boolean} params.nothingFound - Flag to indicate if no assets were found.
 * @param {boolean} params.preferCurrent - Flag to prefer current versions of the asset in the search.
 * @param {boolean|string } params.published - Flag to include only published assets in the search.
 * @param {Array} params.roles - The roles to be included in the search.
 * @param {Object} params.ctx - The Moleculer context.
 * @returns {Promise<Array>} - Returns the filtered assets.
 */
async function filterByPublishStatus({
  assets: _assets,
  assetsWithPermissions,
  nothingFound,
  preferCurrent,
  published,
  roles,
  ctx,
}) {
  let assets = _assets;

  if (!nothingFound) {
    assets = await ctx.tx.call('common.versionControl.getVersion', {
      id: map(assets, 'asset'),
    });

    if (published !== 'all') {
      assets = assets.filter(({ published: isPublished }) => isPublished === published);
    }

    // EN: Filter by preferCurrent status
    // ES: Filtrar por estado preferCurrent
    const groupedAssets = groupBy(assets, (id) => id.uuid);

    if (preferCurrent) {
      // EN: Get the latest versions of each uuid
      // ES: Obtener la última versión de cada uuid
      assets = map(groupedAssets, (values) => {
        const versions = map(values, (id) => id.version);

        const latest = semver.maxSatisfying(versions, '*');

        return find(values, (id) => id.version === latest).fullId;
      });
    } else {
      assets = assets.map(({ fullId }) => fullId);
    }

    assets = assetsWithPermissions.filter(
      ({
        asset,
        role,
        // ...others
      }) => {
        if (roles?.length && !roles.includes(role)) {
          return false;
        }
        return assets.includes(asset);
      }
    );
  }

  return uniqBy(assets, 'asset') || [];
}

module.exports = {
  filterByPublishStatus,
};
