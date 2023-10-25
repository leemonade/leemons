/* eslint-disable no-param-reassign */
const { isArray, map } = require('lodash');
const { CATEGORIES } = require('../../../config/constants');

/**
 * Prepares the asset data for further processing.
 *
 * @param {Object} params - The params object.
 * @param {Object} params.data - The asset data object.
 * @returns {Object} The prepared asset data.
 */
function prepareAssetData({ data }) {
  data.categoryKey = data.categoryKey || CATEGORIES.MEDIA_FILES;

  if (isArray(data.subjects)) {
    data.subjects = map(data.subjects, ({ subject, level }) => ({
      subject,
      level,
    }));
  }

  return data;
}
module.exports = { prepareAssetData };
