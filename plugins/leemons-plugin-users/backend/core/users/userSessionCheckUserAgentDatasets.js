const _ = require('lodash');
const {
  userSessionUserAgentNeedUpdateDataset,
} = require('../user-agents/userAgentNeedUpdateDataset');

async function checkUserAgentDataset({ userAgent, ctx }) {
  let good = true;
  if (!userAgent.datasetIsGood) {
    const needUpdate = await userSessionUserAgentNeedUpdateDataset({
      ctx: {
        ...ctx,
        meta: {
          ...ctx.meta,
          userSession: {
            ...ctx.meta.userSession,
            userAgents: [userAgent],
          },
        },
      },
    });
    if (!needUpdate) {
      await ctx.tx.db.UserAgent.updateOne({ id: userAgent.id }, { datasetIsGood: true });
    } else {
      good = false;
    }
  }
  return good;
}

async function userSessionCheckUserAgentDatasets({ ctx }) {
  let good = true;
  if (
    ctx.meta.userSession &&
    _.isArray(ctx.meta.userSession.userAgents) &&
    ctx.meta.userSession.userAgents.length
  ) {
    const results = await Promise.all(
      ctx.meta.userSession.userAgents.map((userAgent) => checkUserAgentDataset({ userAgent, ctx }))
    );
    _.forEach(results, (result) => {
      if (!result) {
        good = false;
      }
    });
  }
  return good;
}

module.exports = { userSessionCheckUserAgentDatasets };
