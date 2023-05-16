const { table } = require('../tables');

const { validateAddKanbanColumn } = require('../../validations/forms');
const { translations } = require('../../translations');

/**
 * Add kanban column
 * @public
 * @static
 * @param {string} key - key
 * @param {any} data - Event data
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function add(data, { transacting: _transacting } = {}) {
  validateAddKanbanColumn(data);

  return global.utils.withTransaction(
    async (transacting) => {
      const locales = translations();
      const { name, ..._data } = data;
      const column = await table.kanbanColumns.create(_data, { transacting });
      await locales.common.addManyByKey(
        leemons.plugin.prefixPN(`kanban.columns.${column.id}`),
        name,
        {
          transacting,
        }
      );
      return column;
    },
    table.calendars,
    _transacting
  );
}

module.exports = { add };
