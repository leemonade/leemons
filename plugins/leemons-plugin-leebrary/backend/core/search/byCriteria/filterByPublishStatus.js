const { uniqBy, find, groupBy, map, isString, uniq } = require('lodash');

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
  nothingFound,
  preferCurrent,
  published,
  ctx,
}) {
  let assets = _assets;

  const assetsIds = assets.map((asset) => asset?.asset ?? asset);

  if (!nothingFound) {
    assets = await ctx.tx.call('common.versionControl.getVersion', {
      id: assetsIds,
      getLatestInfo: true,
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
        // EN: Get the latest published and unpublished versions of each uuid if already matched in the search
        // ES: Obtener la última versión publicada y no publicada de cada uuid si ya están en la búsqueda
        const latestVersion = values.find((version) => version.isLatestVersion);

        return find(values, (id) => id.version === latestVersion?.version)?.fullId;
      }).filter(Boolean);
    } else {
      assets = assets.map(({ fullId }) => fullId);
    }
  }

  const [assetChecker] = assets;
  return isString(assetChecker) ? uniq(assets) : uniqBy(assets, 'asset');
}

module.exports = {
  filterByPublishStatus,
};


