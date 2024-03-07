/**
 * Return all action in bbdd
 * @public
 * @static
 * @param {Object} params
 * @param {MoleculerContext} params.ctx Moleculer context
 * */
async function list({ ctx }) {
  return ctx.tx.db.Actions.find().sort({ order: 'asc' }).lean();
}

module.exports = { list };
