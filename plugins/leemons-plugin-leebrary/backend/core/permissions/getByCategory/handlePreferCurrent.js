/* eslint-disable no-param-reassign */
const { map, groupBy, find, omit } = require('lodash');
const semver = require('semver');

/**
 * This function handles the preference for current assets. It takes in an object with results and context.
 *
 * @param {Object} params - An object.
 * @param {Array} params.results - An array of assets.
 * @param {MoleculerContext} params.ctx - The context object containing transaction details.
 * @returns {Promise<Array>} - Returns an array of assets with the latest version for each unique uuid.
 */
async function handlePreferCurrent({ results, ctx }) {
  results = await Promise.all(
    results.map(async (item) => ({
      ...(await ctx.tx.call('common.versionControl.parseId', {
        id: item.asset,
        verifyVersion: false,
        ignoreMissing: true,
      })),
      ...item,
    }))
  );

  // * To implement: Remove and use setAsCurrent on asset creation
  // EN: Filter by preferCurrent status
  // ES: Filtrar por estado preferCurrent
  const groupedAssets = groupBy(results, (asset) => asset.uuid);

  // EN: Get the latest versions of each uuid
  // ES: Obtener la última versión de cada uuid
  return map(groupedAssets, (values) => {
    const versions = map(values, (id) => id.version);

    const latest = semver.maxSatisfying(versions, '*');

    return omit(
      find(values, (id) => id.version === latest),
      ['uuid', 'version', 'fullId']
    );
  });
}

module.exports = { handlePreferCurrent };
