const _ = require('lodash');
const { table } = require('../tables');

/**
 * List kanban columns
 * @public
 * @static
 * @param {any} userSession - User session
 * @param {string=} column - Kanban Column
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list(userSession, { column, transacting } = {}) {
  const query = {
    userAgent: userSession.userAgents[0].id,
  };
  if (column) query.column = column;
  const response = await table.kanbanEventOrders.find(query, { transacting });
  return _.map(response, (r) => ({ ...r, events: JSON.parse(r.events) }));
}

module.exports = { list };
