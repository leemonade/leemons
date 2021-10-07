const _ = require('lodash');
const { table } = require('../tables');
const { validateNotExistEvent } = require('../../validations/exists');

/**
 * Return event if exists
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detail(id, { transacting } = {}) {
  await validateNotExistEvent(id, { transacting });
  const event = await table.events.findOne({ id }, { transacting });
  return { ...event, data: _.isString(event.data) ? JSON.parse(event.data) : event.data };
}

module.exports = { detail };
