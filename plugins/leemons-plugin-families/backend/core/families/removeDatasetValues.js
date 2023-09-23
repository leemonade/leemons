const _ = require('lodash');

/**
 * Remove the family dataset values
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeDatasetValues({ family, ctx, tx = true }) {
  const locationName = 'families-data';
  const pluginName = 'families';

  const call = tx ? ctx.tx.call : ctx.call;

  if (await call('dataset.dataset.existValues', { locationName, pluginName, target: family })) {
    return call('dataset.dataset.deleteValues', { locationName, pluginName, target: family });
  }
  return null;
}

module.exports = { removeDatasetValues };
