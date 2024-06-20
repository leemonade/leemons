const _ = require('lodash');
const { LeemonsError } = require('@leemons/error');

async function saveData({ value, locationName, ctx }) {
  const response = await ctx.tx.call('dataset.dataset.setValues', {
    locationName,
    pluginName: 'users',
    values: value,
    userAgent: ctx.meta.userSession.userAgents,
    target: ctx.meta.userSession.userAgents[0].id,
  });

  await ctx.tx.db.UserAgent.updateOne(
    { id: ctx.meta.userSession.userAgents[0].id },
    { datasetIsGood: true }
  );
  return response;
}

async function saveDataForUserAgentDatasets({ data, ctx }) {
  // ES: Comprobamos si las ids de los userAgents coinciden
  if (!_.isEqual(_.map(ctx.meta.userSession.userAgents, 'id'), _.map(data, 'userAgent'))) {
    throw new LeemonsError(ctx, { message: 'UserAgents ids do not match' });
  }
  return Promise.all(
    _.map(data, (d) =>
      saveData({
        value: d.value,
        locationName: d.locationName,
        ctx: {
          ...ctx,
          meta: {
            ...ctx.meta,
            userSession: {
              ...ctx.meta.userSession,
              userAgents: [_.find(ctx.meta.userSession.userAgents, { id: d.userAgent })],
            },
          },
        },
      })
    )
  );
}

module.exports = { saveDataForUserAgentDatasets };
