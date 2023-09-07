const _ = require('lodash');
const {
  getCurriculumSelectedContentValueByKey,
} = require('./getCurriculumSelectedContentValueByKey');
const { getNodeLevelSchema } = require('../nodeLevels/getNodeLevelSchema');
const { getNodeValues } = require('../nodes/nodesTreeByCurriculum');

async function getDataForKeys({ keys, ctx }) {
  const { userSession } = ctx.meta;
  const values = _.map(keys, (key) => getCurriculumSelectedContentValueByKey(key));
  const curriculumIds = _.uniq(_.map(values, 'curriculum'));
  const nodeLevelIds = _.uniq(_.map(values, 'nodeLevel'));
  const nodeIds = _.uniq(_.map(values, 'node'));
  const valuesByNodeLevel = _.keyBy(values, 'nodeLevel');
  const valuesByNode = _.keyBy(values, 'node');

  const curriculumns = await ctx.tx.db.Curriculums.find(
    { id: curriculumIds },
    {
      columns: ['id', 'locale'],
    }
  ).lean();
  const curriculumsById = _.keyBy(curriculumns, 'id');

  const [_nodes, schemas, nodeValues] = await Promise.all([
    ctx.tx.db.Nodes.find({ id: nodeIds }).lean(),
    Promise.all(
      _.map(nodeLevelIds, (nodeLevelId) =>
        getNodeLevelSchema({
          nodeLevelId,
          locale: curriculumsById[valuesByNodeLevel[nodeLevelId].curriculum].locale,
          ctx,
        })
      )
    ),
    Promise.all(
      _.map(nodeIds, (nodeId) =>
        getNodeValues({ node: { id: nodeId, nodeLevel: valuesByNode[nodeId].nodeLevel }, ctx })
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
