const _ = require('lodash');
const { table } = require('../tables');
const { validateAddNode } = require('../../validations/forms');

async function addNode(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddNode(data, { transacting });
      return table.nodes.create(data, { transacting });
    },
    table.nodes,
    _transacting
  );
}

module.exports = { addNode };
