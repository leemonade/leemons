const { validateNotExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');

/** *
 *  ES:
 *  Si existen los datos especificados los elimina
 *
 *  EN:
 *  If the specified data exists, it is deleted
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} target Any string to differentiate what you want, for example a user id.
 *  @return {Promise<boolean>}
 *  */
async function deleteValues({ locationName, pluginName, target, ctx }) {
  validatePluginName({ pluginName, calledFrom: ctx.callerPlugin, ctx });
  await validateNotExistValues({ locationName, pluginName, target, ctx });

  const query = { locationName, pluginName };
  if (target) query.target = target;

  await ctx.tx.db.DatasetValues.deleteMany(query);

  return true;
}

module.exports = deleteValues;
