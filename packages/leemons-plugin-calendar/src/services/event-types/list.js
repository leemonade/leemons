const _ = require('lodash');
const { table } = require('../tables');

/**
 * Lista all event types
 * @public
 * @static

 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list({ transacting } = {}) {
  let eventTypes = await table.eventTypes.find(undefined, { transacting });
  eventTypes = _.sortBy(eventTypes, 'order');
  return _.map(eventTypes, (eventType) => ({
    ...eventType,
    config: JSON.parse(eventType.config),
  }));
}

module.exports = { list };
