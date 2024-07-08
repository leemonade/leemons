const _ = require('lodash');

async function saveData({ value, locationName, userAgentId, ctx }) {
  const response = await ctx.tx.call('dataset.dataset.setValues', {
    locationName,
    pluginName: 'users',
    values: value,
    userAgent: ctx.meta.userSession.userAgents,
    target: userAgentId,
  });

  const { formData, completed } = response ?? {};

  await ctx.tx.db.UserAgent.updateOne({ id: userAgentId }, { datasetIsGood: completed });
  return formData;
}

async function saveDataForUserAgentDatasets({ data, ctx }) {
  // ES: Comprobamos si las ids de los userAgents coinciden
  // if (!_.isEqual(_.map(ctx.meta.userSession.userAgents, 'id'), _.map(data, 'userAgent'))) {
  //  throw new LeemonsError(ctx, { message: 'UserAgents ids do not match' });
  // }

  return Promise.all(
    _.map(data, (d) =>
      saveData({
        value: d.value,
        locationName: d.locationName,
        userAgentId: d.userAgent,
        ctx,
      })
    )
  );
}

module.exports = { saveDataForUserAgentDatasets };
