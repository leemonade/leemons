const { pick } = require('lodash');

const { getById: getCategory } = require('../../categories/getById');
const { CATEGORIES } = require('../../../config/constants');
const { getDiff } = require('./getDiff');

/**
 * This function handles the update object for the asset. It compares the current asset data with the new asset data and returns the updated object and the differences.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.currentAsset - The current asset object.
 * @param {Object} params.assetData - The new asset data object.
 * @param {MoleculerContext} params.ctx - The Moleculer context.
 * @returns {Promise<Object>} An object containing the updated properties, new data, and the differences.
 */
async function handleUpdateObject({ currentAsset, assetData, ctx }) {
  const compareProps = [
    'name',
    'tagline',
    'description',
    'color',
    'file',
    'cover',
    'public',
    'indexable',
    'tags',
    'program',
    'subjects',
  ];

  const category = await getCategory({ id: currentAsset.category, ctx });
  if (category.key === CATEGORIES.BOOKMARKS) {
    compareProps.push('url');
  }

  const currentData = pick(currentAsset, compareProps);
  currentData.file = currentAsset.file?.id || null;
  currentData.cover = currentAsset.cover?.id || null;

  const newData = pick(assetData, compareProps);
  newData.file = assetData.file || null;
  newData.cover = assetData.cover || assetData.coverFile || null;

  // EN: Diff the current values with the new ones
  // ES: Compara los valores actuales con los nuevos
  const { object: updateProperties, diff } = getDiff(newData, currentData);

  return { updateProperties, newData, diff };
}

module.exports = { handleUpdateObject };
