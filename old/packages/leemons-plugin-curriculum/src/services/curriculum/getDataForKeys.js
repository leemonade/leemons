const _ = require('lodash');
const { table } = require('../tables');
const {
  getCurriculumSelectedContentValueByKey,
} = require('./getCurriculumSelectedContentValueByKey');
const { getNodeLevelSchema } = require('../nodeLevels/getNodeLevelSchema');
const { getNodeValues } = require('../nodes/nodesTreeByCurriculum');

async function getDataForKeys(keys, userSession, { transacting } = {}) {
  const values = _.map(keys, (key) => getCurriculumSelectedContentValueByKey(key));
  const curriculumIds = _.uniq(_.map(values, 'curriculum'));
  const nodeLevelIds = _.uniq(_.map(values, 'nodeLevel'));
  const nodeIds = _.uniq(_.map(values, 'node'));
  const valuesByNodeLevel = _.keyBy(values, 'nodeLevel');
  const valuesByNode = _.keyBy(values, 'node');

  const curriculumns = await table.curriculums.find(
    { id_$in: curriculumIds },
    {
      columns: ['id', 'locale'],
      transacting,
    }
  );
  const curriculumsById = _.keyBy(curriculumns, 'id');

  const [_nodes, schemas, nodeValues] = await Promise.all([
    table.nodes.find({ id_$in: nodeIds }, { transacting }),
    Promise.all(
      _.map(nodeLevelIds, (nodeLevelId) =>
        getNodeLevelSchema(
          nodeLevelId,
          curriculumsById[valuesByNodeLevel[nodeLevelId].curriculum].locale,
          {
            transacting,
          }
        )
      )
    ),
    Promise.all(
      _.map(nodeIds, (nodeId) =>
        getNodeValues({ id: nodeId, nodeLevel: valuesByNode[nodeId].nodeLevel }, userSession, {
          transacting,
        })
      )
    ),
  ]);

  const nodeValuesById = _.keyBy(nodeValues, 'id');
  _.forEach(_nodes, (node) => {
    // eslint-disable-next-line no-param-reassign
    node.formValues = nodeValuesById[node.id].values;
  });

  const schemasByLocationName = _.keyBy(schemas, 'locationName');

  const nodeLevels = {};
  const nodes = {};

  _.forEach(nodeLevelIds, (nodeLevelId) => {
    nodeLevels[nodeLevelId] = schemasByLocationName[`node-level-${nodeLevelId}`] || null;
  });
  _.forEach(_nodes, (node) => {
    nodes[node.id] = node;
  });

  return {
    nodeLevels,
    nodes,
  };
}

module.exports = { getDataForKeys };
