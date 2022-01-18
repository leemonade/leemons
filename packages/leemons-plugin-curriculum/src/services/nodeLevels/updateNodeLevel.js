const _ = require('lodash');
const { table } = require('../tables');
const { validateUpdateNodeLevel } = require('../../validations/forms');

async function updateNodeLevel(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateUpdateNodeLevel(data, { transacting });

      return table.nodeLevels.update({ id: data.id }, data, { transacting });
    },
    table.nodeLevels,
    _transacting
  );
}

module.exports = { updateNodeLevel };
