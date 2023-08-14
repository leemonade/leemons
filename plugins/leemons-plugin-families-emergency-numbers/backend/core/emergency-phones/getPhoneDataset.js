const _ = require('lodash');

async function getPhoneDataset(phone, userSession, { transacting } = {}) {
  const locationName = 'families-emergency-numbers-data';
  const pluginName = 'plugins.families-emergency-numbers';
  const dataset = leemons.getPlugin('dataset').services.dataset;

  return dataset.getValues(locationName, pluginName, userSession.userAgents, {
    target: phone,
    transacting,
  });
}

module.exports = { getPhoneDataset };
