const { table } = require('../tables');
const { validateUpdateGroup } = require('../../validations/forms');

async function updateGroup(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateGroup(data, { transacting });
      const { id, ..._data } = data;
      return table.groups.update({ id }, _data, { transacting });
    },
    table.groups,
    _transacting
  );
}

module.exports = { updateGroup };
