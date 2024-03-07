/* eslint-disable no-param-reassign */

const _ = require('lodash');

async function getAssignSavedConfigs({ ctx }) {
  const configs = await ctx.tx.db.AssignSavedConfig.find({
    userAgent: ctx.meta.userSession.userAgents[0].id,
  }).lean();
  return _.map(configs, (config) => ({
    ...config,
    config: JSON.parse(config.config || null),
  }));
}

module.exports = { getAssignSavedConfigs };
