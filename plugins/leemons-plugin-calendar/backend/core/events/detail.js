const _ = require('lodash');
const { validateNotExistEvent } = require('../../validations/exists');

/**
 * Return event if exists
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detail({ id, ctx }) {
  await validateNotExistEvent({ id, ctx });
  const event = await ctx.tx.db.Events.findOne({ id }).lean();
  return { ...event, data: _.isString(event.data) ? JSON.parse(event.data) : event.data };
}

module.exports = { detail };
