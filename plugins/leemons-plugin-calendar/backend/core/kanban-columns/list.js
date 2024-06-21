const _ = require('lodash');

/**
 * List kanban columns based on visibility settings.
 * This function retrieves all kanban columns from the database and filters them based on the visibility flag.
 *
 * @public
 * @static
 * @param {Object} options - The options for listing kanban columns.
 * @param {boolean} options.showHiddenColumns - Flag to determine if hidden columns should be shown.
 * @param {Object} options.ctx - The context object containing the database transaction and other relevant data.
 * @return {Promise<Array>} A promise that resolves to an array of kanban column objects.
 */
async function list({ showHiddenColumns, ctx }) {
  let columns = await ctx.tx.db.KanbanColumns.find().lean();

  if (!showHiddenColumns) {
    columns = _.filter(columns, (column) => !column.isHidden);
  }

  return _.map(columns, (column) => ({
    ...column,
    nameKey: ctx.prefixPN(`kanban.columns.${column.id}`),
  }));
}

module.exports = { list };
