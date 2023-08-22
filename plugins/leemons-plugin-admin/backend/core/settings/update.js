const _ = require('lodash');
const { LeemonsError } = require('leemons-error');

const findOne = require('./findOne');

/**
 * @public
 * @static
 * @return {Promise<any>}
 * */
async function update({ ctx, ...settings }) {
  let allowed = !ctx.callerPlugin;

  if (
    ctx.callerPlugin &&
    (ctx.callerPlugin.startsWith('bulk-template') ||
      ctx.callerPlugin.startsWith('admin') ||
      ctx.callerPlugin.startsWith('gateway'))
  ) {
    allowed = true;
  }

  if (allowed) {
    let currentSettings = await findOne({ ctx });
    if (_.isNil(currentSettings)) {
      currentSettings = await ctx.tx.db.Settings.create({ configured: false });
    }
    const newSettings = { ...currentSettings.toObject(), ...settings };
    delete newSettings.id;

    return ctx.tx.db.Settings.findOneAndUpdate({ id: currentSettings.id }, newSettings, {
      lean: true,
      new: true,
    });
  }

  throw new LeemonsError(ctx, { message: 'This method can only be called from the admin' });
}

module.exports = update;
