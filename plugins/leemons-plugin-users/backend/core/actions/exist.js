/**
 * Check if exist action
 * @public
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * @param {string} params.actionName - Action name
 * @return {Promise<boolean>} Created actions
 * */
async function exist({ actionName, ctx }) {
  const result = await ctx.tx.db.Actions.countDocuments({ actionName });
  return !!result;
}

module.exports = { exist };
