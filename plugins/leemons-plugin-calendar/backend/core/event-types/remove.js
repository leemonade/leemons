const { validateKeyPrefix, validateNotExistEventTypeKey } = require('../../validations/exists');

/**
 * Remove event type with the provided key
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove({ key, ctx }) {
  validateKeyPrefix({ key, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistEventTypeKey({ key, ctx });
  return ctx.tx.db.EventTypes.deleteOne({ key });
}

module.exports = { remove };
