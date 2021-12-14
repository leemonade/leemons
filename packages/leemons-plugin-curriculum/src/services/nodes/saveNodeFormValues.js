const _ = require('lodash');
const { table } = require('../tables');
const { setDatasetValues } = require('./setDatasetValues');

async function saveNodeFormValues(
  nodeId,
  userSession,
  formValues,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const node = await table.nodes.findOne({ id: nodeId }, { transacting });
      await setDatasetValues(node, userSession, formValues, { transacting });
    },
    table.nodes,
    _transacting
  );
}

module.exports = { saveNodeFormValues };
