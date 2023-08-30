const _ = require('lodash');

/**
 * List kanban columns
 * @public
 * @static
 * @param {any} userSession - User session
 * @param {string=} column - Kanban Column
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list({ column, ctx }) {
  const { userSession } = ctx.meta;
  const query = {
    userAgent: userSession.userAgents[0].id,
  };
  if (column) query.column = column;
  const response = await ctx.tx.db.KanbanEventOrders.find(query).lean();
  return _.map(response, (r) => ({ ...r, events: JSON.parse(r.events) }));
}

module.exports = { list };
