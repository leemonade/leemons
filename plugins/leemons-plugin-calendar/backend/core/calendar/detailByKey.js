const _ = require('lodash');
const { validateNotExistCalendarKey } = require('../../validations/exists');

/**
 * Return calendar if exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detailByKey({ key, ctx }) {
  await validateNotExistCalendarKey({ key, ctx });
  return ctx.tx.db.Calendars.findOne({ key }).lean();
}

module.exports = { detailByKey };
