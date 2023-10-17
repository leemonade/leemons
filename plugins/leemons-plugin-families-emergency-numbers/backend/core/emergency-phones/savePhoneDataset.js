async function savePhoneDataset({ phone, values, ctx }) {
  const locationName = 'families-emergency-numbers-data';
  const pluginName = 'families-emergency-numbers';
  let functionName = 'addValues';
  if (
    await ctx.tx.call('dataset.dataset.existValues', { locationName, pluginName, target: phone })
  ) {
    functionName = 'updateValues';
  }
  return ctx.tx.call(`dataset.dataset.${functionName}`, {
    locationName,
    pluginName,
    formData: values,
    userAgent: ctx.meta.userSession.userAgents,
    target: phone,
  });
}

module.exports = { savePhoneDataset };
