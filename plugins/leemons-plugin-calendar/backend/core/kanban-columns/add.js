const { validateAddKanbanColumn } = require('../../validations/forms');

/**
 * Add kanban column
 * @public
 * @static
 * @param {string} key - key
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add({ data, ctx }) {
  validateAddKanbanColumn(data);

  // const locales = translations();
  //   transacting,
  // });
  const { name, ..._data } = data;
  const columnDoc = await ctx.tx.db.KanbanColumns.create(_data);
  const column = columnDoc.toObject();
  // await locales.common.addManyByKey(
  //   leemons.plugin.prefixPN(`kanban.columns.${column.id}`),
  //   name,
  //   {
  //     transacting,
  //   }
  // );
  await ctx.tx.call('multilanguage.common.addManyByKey', {
    key: ctx.prefixPN(`kanban.columns.${column.id}`),
    data: name,
  });

  return column;
}

module.exports = { add };
