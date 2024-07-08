const _ = require('lodash');
const {
  userSessionUserAgentNeedUpdateDataset,
} = require('../user-agents/userAgentNeedUpdateDataset');

/**
 * Checks if the user agent's dataset is up-to-date and updates it if necessary.
 *
 * This function verifies whether the dataset associated with a user agent is current.
 * If the dataset is not up-to-date, it triggers an update process and marks the dataset
 * as good if the update is successful.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.userAgent - The user agent object to check.
 * @param {MoleculerContext} params.ctx - The context object containing session and transaction information.
 *
 * @returns {Promise<boolean>} - Returns `true` if the dataset is good, otherwise `false`.
 */
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

/**
 * Checks if all user agent datasets are up-to-date.
 *
 * @param {Object} params - The parameters for the function.
 * @param {MoleculerContext} params.ctx - The context object containing session and transaction information.
 * @returns {Promise<boolean>} - Returns `true` if all datasets are good, otherwise `false`.
 */
async function userSessionCheckUserAgentDatasets({ ctx }) {
  let good = true;
  if (ctx.meta.userSession?.userAgents?.length) {
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
