const { table } = require('../tables');
const { validateAddGroup } = require('../../validations/forms');
const { getNextGroupIndex } = require('./getNextGroupIndex');
const { addNextGroupIndex } = require('./addNextGroupIndex');

async function addGroup(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddGroup(data, { transacting });
      const index = await getNextGroupIndex(data.program, { transacting });
      await addNextGroupIndex(data.program, { index, transacting });
      return table.groups.create({ ...data, index, type: 'group' }, { transacting });
    },
    table.groups,
    _transacting
  );
}

module.exports = { addGroup };
