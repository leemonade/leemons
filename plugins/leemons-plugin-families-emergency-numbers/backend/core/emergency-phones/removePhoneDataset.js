async function removePhoneDataset({ phone, ctx }) {
  const locationName = 'families-emergency-numbers-data';
  const pluginName = 'families-emergency-numbers';

  if (
    await ctx.tx.call('dataset.dataset.existValues', { locationName, pluginName, target: phone })
  ) {
    return ctx.tx.call('dataset.dataset.deleteValues', { locationName, pluginName, target: phone });
  }

  return null;
}

module.exports = { removePhoneDataset };
