const _ = require('lodash');

async function saveData({ value, locationName, userId, ctx }) {
  const response = await ctx.tx.call('dataset.dataset.setValues', {
    locationName,
    pluginName: 'users',
    values: value,
    userAgent: ctx.meta.userSession.userAgents,
    target: userId,
  });

  const { formData } = response ?? {};

  return formData;
}

async function saveDataForUserDatasets({ data, ctx }) {
  return Promise.all(
    _.map(data, (d) =>
      saveData({
        value: d.value,
        locationName: d.locationName,
        userId: d.userId,
        ctx,
      })
    )
  );
}

module.exports = { saveDataForUserDatasets };
