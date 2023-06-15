/**
 * ES:
 * Comprueba para los parametros especificados si exista ya o no algún registro
 *
 * EN:
 * Checks for the specified parameters whether or not a record already exists.
 *
 * @public
 * @static
 * @param {ItemPermission} query -
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist({ query, ctx }) {
  const response = await ctx.tx.db.ItemPermissions.countDocuments(query);
  return !!response;
}

module.exports = { exist };
