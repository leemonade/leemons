const _ = require('lodash');

async function removePhoneDataset(phone, { transacting } = {}) {
  const locationName = 'families-emergency-numbers-data';
  const pluginName = 'plugins.families-emergency-numbers';
  const dataset = leemons.getPlugin('dataset').services.dataset;

  if (await dataset.existValues(locationName, pluginName, { target: phone, transacting })) {
    return dataset.deleteValues(locationName, pluginName, {
      target: phone,
      transacting,
    });
  }
  return null;
}

module.exports = { removePhoneDataset };
