const { isNil } = require('lodash');
const { findOne } = require('../findOne');

/**
 * This function is used to set the settings.
 *
 * @param {Object} params - An object.
 * @param {Object} params.settings - The settings to be set.
 * @param {MoleculerContext} params.ctx - The context object.
 * @returns {Promise} Returns a promise that resolves with the updated settings.
 */
async function set({ settings, ctx } = {}) {
  let currentSettings = await findOne({ ctx });
  if (isNil(currentSettings)) {
    const newDoc = await ctx.tx.db.Settings.create({});
    currentSettings = newDoc.toObject();
  }
  const { id, ...newSettings } = { ...currentSettings, ...settings };
  return ctx.tx.db.Settings.findOneAndUpdate({ id: currentSettings.id }, newSettings, {
    new: true,
    lean: true,
  });
}

module.exports = { set };
