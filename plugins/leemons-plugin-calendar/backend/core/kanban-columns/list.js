const _ = require('lodash');

/**
 * List kanban columns
 * @public
 * @static
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function list({ ctx }) {
  let columns = await ctx.tx.db.KanbanColumns.find().lean();
  columns = _.filter(columns, (column) => !column.isHidden);
  return _.map(columns, (column) => ({
    ...column,
    nameKey: ctx.prefixPN(`kanban.columns.${column.id}`),
  }));
}

module.exports = { list };
