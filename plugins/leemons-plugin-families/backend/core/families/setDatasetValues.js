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
async function setDatasetValues({ family, values, ctx }) {
  const locationName = 'families-data';
  const pluginName = 'families';
  let functionName = 'addValues';

  if (
    await ctx.tx.call('dataset.dataset.existValues', { locationName, pluginName, target: family })
  ) {
    functionName = 'updateValues';
  }
  return ctx.tx.call(`dataset.dataset.${functionName}`, {
    locationName,
    pluginName,
    formData: values,
    userAgent: ctx.meta.userSession.userAgents,
    target: family,
  });
}

module.exports = { setDatasetValues };
