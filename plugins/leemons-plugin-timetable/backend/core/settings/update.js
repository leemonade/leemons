const _ = require('lodash');
const findOne = require('./findOne');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function update({ settings, ctx }) {
  let currentSettings = await findOne({ ctx });
  if (_.isNil(currentSettings)) {
    currentSettings = await ctx.tx.db.Settings.create({ hideWelcome: false, configured: false });
    currentSettings = currentSettings.toObject();
  }
  const newSettings = { ...currentSettings, ...settings };
  delete newSettings.id;

  return ctx.tx.db.Settings.findOneAndUpdate({ id: currentSettings.id }, newSettings, {
    lean: true,
    new: true,
  });
}

module.exports = update;
