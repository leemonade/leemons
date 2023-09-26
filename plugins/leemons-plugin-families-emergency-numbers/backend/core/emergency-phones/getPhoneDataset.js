const _ = require('lodash');

async function getPhoneDataset({ phone, ctx }) {
  const locationName = 'families-emergency-numbers-data';
  const pluginName = 'families-emergency-numbers';

  return ctx.tx.call('dataset.dataset.getValues', {
    locationName,
    pluginName,
    userAgent: ctx.meta.userSession?.userAgents,
    target: phone,
  });
}

module.exports = { getPhoneDataset };
