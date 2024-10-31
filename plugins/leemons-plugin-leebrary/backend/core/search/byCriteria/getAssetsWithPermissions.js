const { uniq } = require('lodash');

const { getByAssets: getPermissions } = require('../../permissions/getByAssets');

const { filterByPublishStatus } = require('./filterByPublishStatus');
/**
 * Retrieves assets with permissions based on the provided parameters.
 *
 * @param {Object} params - The parameters for the retrieval.
 * @param {Array} params.assets - The assets to be retrieved.
 * @param {boolean} params.nothingFound - Flag to indicate if no assets were found.
 * @param {boolean} params.onlyShared - Flag to indicate if only shared assets should be retrieved.
 * @param {boolean} params.preferCurrent - Flag to indicate if current assets should be preferred.
 * @param {string} params.published - The publish status of the assets to be retrieved.
 * @param {Array} params.roles - The roles to be included in the retrieval.
 * @param {boolean} params.showPublic - Flag to indicate if public assets should be shown.
 * @param {Object} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} - Returns an object containing the retrieved assets and a flag indicating if no assets were found.
 */

async function getAssetsWithPermissions({
  assets: _assets,
  nothingFound: _nothingFound,
  onlyShared,
  preferCurrent,
  published,
  roles,
  showPublic,
  ctx,
}) {
  let nothingFound = _nothingFound;
  let assets = _assets;

  let assetsWithPermissions = [];
  if (!nothingFound) {
    assetsWithPermissions = await getPermissions({
      assetIds: uniq(assets),
      showPublic,
      onlyShared,
      ctx,
    });
    assets = assetsWithPermissions;
    nothingFound = assets.length === 0;
  }

  assets = await filterByPublishStatus({
    assets,
    assetsWithPermissions,
    nothingFound,
    preferCurrent,
    published,
    roles,
    ctx,
  });

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

  return assets;
}

module.exports = { getAssetsWithPermissions };
