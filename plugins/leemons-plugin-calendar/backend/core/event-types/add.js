const { validateKeyPrefix, validateExistEventTypeKey } = require('../../validations/exists');

/**
 * Add event type with the provided key if not already exists
 * */
async function add({ key, url, options = {}, order, ctx } = {}) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });

  await validateExistEventTypeKey({ key, ctx });
  const eventType = await ctx.tx.db.EventTypes.create({
    ...options,
    config: JSON.stringify(options.config || {}),
    key,
    url,
    order,
    pluginName: ctx.callerPlugin,
  });
  return eventType.toObject();
}

module.exports = { add };
