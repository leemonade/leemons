const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateNodeLevel } = require('../../validations/forms');

async function addNodeLevels(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateNodeLevel(data, { transacting });

      const { id, ...rest } = data;

      return table.nodeLevels.update({ id }, rest, { transacting });
    },
    table.nodeLevels,
    _transacting
  );
}

module.exports = { addNodeLevels };
