const _ = require('lodash');

async function savePhoneDataset(phone, values, userSession, { transacting } = {}) {
  const locationName = 'families-emergency-numbers-data';
  const pluginName = 'plugins.families-emergency-numbers';
  const dataset = leemons.getPlugin('dataset').services.dataset;
  let functionName = 'addValues';
  if (await dataset.existValues(locationName, pluginName, { target: phone, transacting })) {
    functionName = 'updateValues';
  }
  return dataset[functionName](locationName, pluginName, values, userSession.userAgents, {
    target: phone,
    transacting,
  });
}

module.exports = { savePhoneDataset };
