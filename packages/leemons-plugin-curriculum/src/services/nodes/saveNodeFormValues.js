const _ = require('lodash');
const { table } = require('../tables');
const { setDatasetValues } = require('./setDatasetValues');
const { updateNodeLevelFormPermissions } = require('../nodeLevels/updateNodeLevelFormPermissions');

async function saveNodeFormValues(
  nodeId,
  userSession,
  formValues,
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      const node = await table.nodes.findOne({ id: nodeId }, { transacting });

      // TODO Cambiar a que cuando se guarde los campos ya se guarden con los permisos correctos si no toca recalcular cada vez
      await updateNodeLevelFormPermissions(node.nodeLevel, { transacting });

      await setDatasetValues(node, userSession, formValues, { transacting });

      // TODO Recalcular los indices de las listas y los grupos
    },
    table.nodes,
    _transacting
  );
}

module.exports = { saveNodeFormValues };
