const { table } = require('../tables');

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
async function save(userSession, column, events, { transacting } = {}) {
  const result = await table.kanbanEventOrders.set(
    { userAgent: userSession.userAgents[0].id },
    { userAgent: userSession.userAgents[0].id, column, events: JSON.stringify(events) },
    { transacting }
  );
  return { ...result, events: JSON.parse(result.events) };
}

module.exports = { save };
