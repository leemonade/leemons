const { validateSetItem } = require('../../validations/forms');

const { remove } = require('./remove');

/**
 * Sets a custom period for an academic item (class | subject).
 *
 * @param {object} params - The parameters for setting or updating a custom period.
 * @param {string} params.item - The LRN ID item of the item the custom period is set to.
 * @param {string} params.type - The type of the item (class | subject).
 * @param {Date} params.startDate - The start date for the custom period.
 * @param {Date} params.endDate - The end date for the custom period.
 * @param {Moleculer.Context} params.ctx - The context object containing transactional connection details.
 * @returns {Promise<object>} The newly set or updated custom period object.
 */
async function setItem({ item, type, startDate, endDate, ctx }) {
  validateSetItem({ data: { item, type, startDate, endDate }, ctx });

  if (startDate && endDate) {
    return ctx.tx.db.CustomPeriod.findOneAndUpdate(
      { item, type },
      { startDate, endDate },
      { upsert: true, new: true }
    );
  }

  return remove({ item, ctx });
}

module.exports = { setItem };
