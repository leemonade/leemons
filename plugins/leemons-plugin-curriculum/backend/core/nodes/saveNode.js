/* eslint-disable no-param-reassign */
const _ = require('lodash');
const { randomString } = require('leemons-utils');

/*
const { setDatasetValues } = require('./setDatasetValues');
const { updateNodeLevelFormPermissions } = require('../nodeLevels/updateNodeLevelFormPermissions');
const { recalculeAllIndexes } = require('../curriculum/recalculeAllIndexes');
const {
  updateUserAgentPermissionsByUserSession,
} = require('../configs/updateUserAgentPermissionsByUserSession');
 */
async function saveNode({ nodeId, datasetValues: _datasetValues, ctx, ...rest }) {
  function addIds(datasetValues, value) {
    datasetValues.id = value.id || randomString();
    if (_.isArray(datasetValues.value)) {
      _.forEach(datasetValues.value, (v) => {
        v.id = v.id || randomString();
        if (v.childrens) {
          _.forEach(v.childrens, (vv) => {
            vv.id = vv.id || randomString();
            if (vv.childrens) {
              _.forEach(vv.childrens, (vvv) => {
                vvv.id = vvv.id || randomString();
              });
            }
          });
        }
      });
    }
    if (_.isPlainObject(datasetValues.value)) {
      _.forIn(datasetValues.value, (v) => {
        v.id = v.id || randomString();
        if (_.isArray(v.value)) {
          _.forEach(v.value, (vv) => {
            vv.id = vv.id || randomString();
            if (vv.childrens) {
              _.forEach(vv.childrens, (vvv) => {
                vvv.id = vvv.id || randomString();
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

  await ctx.tx.db.Nodes.updateOne(
    { id: nodeId },
    {
      ...rest,
      data: JSON.stringify(_datasetValues),
    }
  );

  /*
  // TODO Cambiar a que cuando se guarde los campos ya se guarden con los permisos correctos si no toca recalcular cada vez
  await updateNodeLevelFormPermissions(node.nodeLevel, { transacting });
  await updateUserAgentPermissionsByUserSession(userSession, { transacting });
  await setDatasetValues(node, userSession, datasetValues, { transacting });
  await recalculeAllIndexes(node.curriculum, userSession, { transacting });

   */
}

module.exports = { saveNode };
