/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { table } = require('../tables');

/*
const { setDatasetValues } = require('./setDatasetValues');
const { updateNodeLevelFormPermissions } = require('../nodeLevels/updateNodeLevelFormPermissions');
const { recalculeAllIndexes } = require('../curriculum/recalculeAllIndexes');
const {
  updateUserAgentPermissionsByUserSession,
} = require('../configs/updateUserAgentPermissionsByUserSession');
 */
async function saveNode(
  nodeId,
  userSession,
  { datasetValues, ...rest },
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      _.forIn(datasetValues, (value, key) => {
        datasetValues[key].id = value.id || global.utils.randomString();
        if (_.isArray(datasetValues[key].value)) {
          _.forEach(datasetValues[key].value, (v) => {
            v.id = v.id || global.utils.randomString();
          });
        }
        if (_.isPlainObject(datasetValues[key].value)) {
          _.forIn(datasetValues[key].value, (v) => {
            v.id = v.id || global.utils.randomString();
            if (_.isArray(v.value)) {
              _.forEach(v.value, (vv) => {
                vv.id = vv.id || global.utils.randomString();
              });
            }
          });
        }
      });

      await table.nodes.update(
        { id: nodeId },
        {
          ...rest,
          data: JSON.stringify(datasetValues),
        },
        { transacting }
      );

      /*
      // TODO Cambiar a que cuando se guarde los campos ya se guarden con los permisos correctos si no toca recalcular cada vez
      await updateNodeLevelFormPermissions(node.nodeLevel, { transacting });
      await updateUserAgentPermissionsByUserSession(userSession, { transacting });
      await setDatasetValues(node, userSession, datasetValues, { transacting });
      await recalculeAllIndexes(node.curriculum, userSession, { transacting });

       */
    },
    table.nodes,
    _transacting
  );
}

module.exports = { saveNode };
