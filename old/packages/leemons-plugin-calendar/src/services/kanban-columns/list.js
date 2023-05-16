const _ = require('lodash');
const { table } = require('../tables');

/**
 * List kanban columns
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list({ transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const columns = await table.kanbanColumns.find({}, { transacting });
      return _.map(columns, (column) => ({
        ...column,
        nameKey: leemons.plugin.prefixPN(`kanban.columns.${column.id}`),
      }));
    },
    table.calendars,
    _transacting
  );
}

module.exports = { list };
