const { validateKeyPrefix, validateNotExistEventTypeKey } = require('../../validations/exists');

/**
 * Update event type with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {string} url - Frontend url
 * @param {any?} options - Additional options
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update({ key, url, options = {}, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistEventTypeKey({ key, ctx });
  const { id, key: __, pluginName, ...opt } = options;
  return ctx.tx.db.EventTypes.findOneAndUpdate({ key }, { ...opt, url }, { new: true, lean: true });
}

module.exports = { update };
