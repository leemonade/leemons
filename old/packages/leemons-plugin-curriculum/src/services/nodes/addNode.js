const _ = require('lodash');
const { table } = require('../tables');
const { validateAddNode } = require('../../validations/forms');
const { reloadNodeFullNamesForCurriculum } = require('./reloadNodeFullNamesForCurriculum');

async function addNode(data, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateAddNode(data, { transacting });
      const node = await table.nodes.create(data, { transacting });
      await reloadNodeFullNamesForCurriculum(data.curriculum, { transacting });
      return node;
    },
    table.nodes,
    _transacting
  );
}

module.exports = { addNode };
