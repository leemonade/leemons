/** *
 *  ES:
 *  Comprueba si ya existen valores para los datos especificados
 *
 *  EN:
 *  Checks if values for the specified data already exist
 *
 *  @public
 *  @static
 *  @param {string} obj.locationName Location name (For backend)
 *  @param {string} obj.pluginName Plugin name (For backend)
 *  @param {string=} obj.target Any string to differentiate what you want, for example a user id.
 *  @param {Object} obj.ctx - moleculer ctx
 *  @return {Promise<boolean>}
 *  */
async function existValues({ locationName, pluginName, target, ctx }) {
  const query = { locationName, pluginName };
  if (target) query.target = target;
  const count = await ctx.tx.db.DatasetValues.countDocuments(query);
  return !!count;
}

module.exports = existValues;
