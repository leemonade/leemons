const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

async function saveData({ value, ctx }) {
  const response = await ctx.tx.call('dataset.dataset.setValues', {
    locationName: 'user-data',
    pluginName: 'users',
    values: value,
    userAgent: ctx.userSession.userAgents,
    target: ctx.userSession.userAgents[0].id,
  });

  await ctx.tx.db.UserAgent.updateOne(
    { id: ctx.userSession.userAgents[0].id },
    { datasetIsGood: true }
  );
  return response;
}

async function saveDataForUserAgentDatasets({ data, ctx }) {
  // ES: Comprobamos si las ids de los userAgents coinciden
  if (!_.isEqual(_.map(ctx.userSession.userAgents, 'id'), _.map(data, 'userAgent'))) {
    throw new LeemonsError(ctx, { message: 'UserAgents ids do not match' });
  }
  return Promise.all(
    _.map(data, (d) =>
      saveData({
        value: d.value,
        ctx: {
          ...ctx,
          userSession: {
            ...ctx.userSession,
            userAgents: [_.find(ctx.userSession.userAgents, { id: d.userAgent })],
          },
        },
      })
    )
  );
}

module.exports = { saveDataForUserAgentDatasets };
