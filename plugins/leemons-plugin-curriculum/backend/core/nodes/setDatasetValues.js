const _ = require('lodash');

async function setDatasetValues({ node, userSession, values, ctx }) {
  const locationName = `node-level-${node.nodeLevel}`;
  const pluginName = 'curriculum';
  let functionName = 'addValues';
  if (
    await ctx.tx.call('dataset.dataset.existValues', { locationName, pluginName, target: node.id })
  ) {
    functionName = 'updateValues';
  }
  return ctx.tx.call(`dataset.dataset.${functionName}`, {
    locationName,
    pluginName,
    formData: values,
    userAgent: userSession.userAgents,
    target: node.id,
  });
}

module.exports = { setDatasetValues };
