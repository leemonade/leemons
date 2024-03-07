const _ = require('lodash');

/**
 * Lista all event types
 * @public
 * @static

 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list({ ctx }) {
  let eventTypes = await ctx.tx.db.EventTypes.find().lean();
  eventTypes = _.sortBy(eventTypes, 'order');
  return _.map(eventTypes, (eventType) => ({
    ...eventType,
    config: JSON.parse(eventType.config || null),
  }));
}

module.exports = { list };
