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
  { datasetValues: _datasetValues, ...rest },
  { transacting: _transacting } = {}
) {
  return global.utils.withTransaction(
    async (transacting) => {
      function addIds(datasetValues, value) {
        datasetValues.id = value.id || global.utils.randomString();
        if (_.isArray(datasetValues.value)) {
          _.forEach(datasetValues.value, (v) => {
            v.id = v.id || global.utils.randomString();
            if (v.childrens) {
              _.forEach(v.childrens, (vv) => {
                vv.id = vv.id || global.utils.randomString();
                if (vv.childrens) {
                  _.forEach(vv.childrens, (vvv) => {
                    vvv.id = vvv.id || global.utils.randomString();
                  });
                }
              });
            }
          });
        }
        if (_.isPlainObject(datasetValues.value)) {
          _.forIn(datasetValues.value, (v) => {
            v.id = v.id || global.utils.randomString();
            if (_.isArray(v.value)) {
              _.forEach(v.value, (vv) => {
                vv.id = vv.id || global.utils.randomString();
                if (vv.childrens) {
                  _.forEach(vv.childrens, (vvv) => {
                    vvv.id = vvv.id || global.utils.randomString();
                  });
                }
              });
            }
          });
        }
      }

      _.forIn(_datasetValues, (value, key) => {
        if (_.isArray(_datasetValues[key])) {
          _.forEach(_datasetValues[key], (_datasetValue) => {
            addIds(_datasetValue, value);
          });
        } else {
          addIds(_datasetValues[key], value);
        }
      });

      await table.nodes.update(
        { id: nodeId },
        {
          ...rest,
          data: JSON.stringify(_datasetValues),
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
