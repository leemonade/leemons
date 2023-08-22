const {
  validateKeyPrefix,
  validateSectionPrefix,
  validateNotExistCalendarKey,
} = require('../../validations/exists');
const { validateAddCalendar } = require('../../validations/forms');

/**
 * Update calendar with the provided key if not already exists
 * @public
 * @static
 * @param {string} key - key
 * @param {any} config - Calendar config
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function update({ key, config, ctx }) {
  validateKeyPrefix(key, this.calledFrom);
  validateSectionPrefix(config.section, this.calledFrom);
  validateAddCalendar(config);

  await validateNotExistCalendarKey({ key, ctx });
  return ctx.tx.db.Calendars.findOneAndUpdate(
    { key },
    {
      ...config,
      metadata: JSON.stringify(config.metadata),
    },
    { new: true, lean: true }
  );
}

module.exports = { update };
