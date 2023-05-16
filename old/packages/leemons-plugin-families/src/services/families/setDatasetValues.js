const _ = require('lodash');

/**
 * Create/Update the family dataset values
 * @public
 * @static
 * @param {string} family - Family id
 * @param {any} userSession - User session
 * @param {any} values - Dataset values
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setDatasetValues(family, userSession, values, { transacting } = {}) {
  const locationName = 'families-data';
  const pluginName = 'plugins.families';
  const dataset = leemons.getPlugin('dataset').services.dataset;
  let functionName = 'addValues';
  if (await dataset.existValues(locationName, pluginName, { target: family, transacting })) {
    functionName = 'updateValues';
  }
  return dataset[functionName](locationName, pluginName, values, userSession.userAgents, {
    target: family,
    transacting,
  });
}

module.exports = { setDatasetValues };
