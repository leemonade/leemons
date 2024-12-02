const { difference, map } = require('lodash');

const { getAssetsByProgram } = require('../../assets/getAssetsByProgram');
const { getAssetsBySubject } = require('../../assets/getAssetsBySubject');
const { getIndexables } = require('../../assets/getIndexables');
const { getAssetsByType } = require('../../files/getAssetsByType');

/**
 * Retrieves assets based on the provided parameters.
 *
 * @param {Object} params - The parameters object.
 * @param {Array} params.assets - The assets to be retrieved.
 * @param {boolean} params.indexable - Flag to indicate if only indexable assets should be retrieved.
 * @param {boolean} params.nothingFound - Flag to indicate if no assets were found.
 * @param {boolean} params.onlyShared - Flag to indicate if only shared assets should be retrieved.
 * @param {Array} params.programs - The programs to be included in the retrieval.
 * @param {Array} params.subjects - The subjects to be included in the retrieval.
 * @param {string|array} params.type - The file type or list of file types to filter by
 * @param {Object} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} - Returns an object containing the retrieved assets and a flag indicating if no assets were found.
 */
async function getAssets({
  assets: _assets,
  indexable,
  nothingFound: _nothingFound,
  onlyShared,
  programs,
  subjects,
  type,
  ctx,
}) {
  let assets = _assets;
  let nothingFound = _nothingFound;

  if (!onlyShared) {
    if (type) {
      assets = await getAssetsByType({ type, assets, ctx });
      nothingFound = assets.length === 0;
    }

    if (programs) {
      assets = await getAssetsByProgram({ program: programs, assets, ctx });
      nothingFound = assets.length === 0;
    }

    if (subjects) {
      assets = await getAssetsBySubject({ subject: subjects, assets, ctx });
      nothingFound = assets.length === 0;
    }

    if (indexable && assets && assets.length) {
      assets = await getIndexables({ assetIds: assets, columns: ['id'], ctx });
      assets = map(assets, 'id');
      nothingFound = assets.length === 0;
    }
  } else {
    const sysName = await ctx.tx.call('users.profiles.getProfileSysName');

    if (sysName === 'student') {
      const assetsToRemove = await getAssetsBySubject({ subject: [], assets, ctx });
      assets = difference(assets, assetsToRemove);
    }
  }

  return { assets, nothingFound };
}

module.exports = { getAssets };
