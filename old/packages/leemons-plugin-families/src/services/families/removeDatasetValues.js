const _ = require('lodash');

/**
 * Remove the family dataset values
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeDatasetValues(family, { transacting } = {}) {
  const locationName = 'families-data';
  const pluginName = 'plugins.families';
  const dataset = leemons.getPlugin('dataset').services.dataset;

  if (await dataset.existValues(locationName, pluginName, { target: family, transacting })) {
    return dataset.deleteValues(locationName, pluginName, {
      target: family,
      transacting,
    });
  }
  return null;
}

module.exports = { removeDatasetValues };
