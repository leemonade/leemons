const _ = require('lodash');

async function setDatasetValues(node, userSession, values, { transacting } = {}) {
  const locationName = `node-level-${node.nodeLevel}`;
  const pluginName = 'plugins.curriculum';
  const { dataset } = leemons.getPlugin('dataset').services;
  let functionName = 'addValues';
  if (await dataset.existValues(locationName, pluginName, { target: node.id, transacting })) {
    functionName = 'updateValues';
  }
  return dataset[functionName](locationName, pluginName, values, userSession.userAgents, {
    target: node.id,
    transacting,
  });
}

module.exports = { setDatasetValues };
