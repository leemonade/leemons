const _ = require('lodash');
const findOne = require('./findOne');

/**
 * Updates settings data.
 *
 * @param {MoleculerContext} ctx - The moleculer context
 * @returns {Promise<Array>} - A promise that resolves to an array
 */

async function update({ settings, ctx }) {
  let currentSettings = await findOne({ ctx });
  if (_.isNil(currentSettings)) {
    currentSettings = await ctx.tx.db.Settings.create({
      hideWelcome: false,
      configured: false,
    }).then((mongooseDoc) => mongooseDoc.toObject());
  }
  const newSettings = { ...currentSettings, ...settings };
  delete newSettings.id;

  return ctx.tx.db.Settings.findOneAndUpdate({ id: currentSettings.id }, newSettings, {
    new: true,
    lean: true,
  });
}

module.exports = { update };
