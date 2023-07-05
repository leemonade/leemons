/**
 * Return true if exist center with this name, false if not
 * @private
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {string} params.name
 * @param {string} params.id
 * @return {Promise<boolean>}
 * */
async function existName({ name, id, ctx }) {
  const query = { name };
  if (id) {
    query.id = { $ne: id };
  }
  const exist = await ctx.tx.db.Centers.countDocuments(query);
  return !!exist;
}

module.exports = existName;
