/**
 * Add kanban column
 * @public
 * @static
 * @param {any} userSession - userSession
 * @param {string} column - Column id
 * @param {string[]} events - Events ids
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function save({ column, events, ctx }) {
  const { userSession } = ctx.meta;
  const result = await ctx.tx.db.KanbanEventOrders.findOneAndUpdate(
    { userAgent: userSession.userAgents[0].id },
    { userAgent: userSession.userAgents[0].id, column, events: JSON.stringify(events) },
    { new: true, lean: true, upsert: true }
  );
  return { ...result, events: JSON.parse(result.events) };
}

module.exports = { save };
