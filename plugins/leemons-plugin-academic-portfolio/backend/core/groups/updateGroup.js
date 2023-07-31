const { table } = require('../tables');
const { validateUpdateGroup } = require('../../validations/forms');
const { saveManagers } = require('../managers/saveManagers');

async function updateGroup(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateGroup(data, { transacting });
      const { id, managers, ..._data } = data;
      const [group] = await Promise.all([
        table.groups.update({ id }, _data, { transacting }),
        saveManagers(managers, 'group', id, { transacting }),
      ]);
      return group;
    },
    table.groups,
    _transacting
  );
}

module.exports = { updateGroup };
