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
    (ctx.callerPlugin.startsWith('bulk-template') || ctx.callerPlugin.startsWith('admin'))
  ) {
    allowed = true;
  }

  if (allowed) {
    let currentSettings = await findOne({ ctx });
    if (_.isNil(currentSettings)) {
      currentSettings = await ctx.tx.db.Settings.create({ configured: false });
    }
    const newSettings = { ...currentSettings, ...settings };
    delete newSettings.id;

    return ctx.tx.db.Settings.update({ id: currentSettings.id }, newSettings);
  }

  throw new LeemonsError('This method can only be called from the plugins.admin');
}

module.exports = update;
