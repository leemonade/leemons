const _ = require('lodash');
const { table } = require('../tables');
const { getNodeLevelSchema } = require('./getNodeLevelSchema');

async function nodeLevelsByCurriculum(ids, { transacting } = {}) {
  const nodeLevels = await table.nodeLevels.find(
    { curriculum_$in: _.isArray(ids) ? ids : [ids] },
    { transacting }
  );

  const schemas = await Promise.all(
    _.map(nodeLevels, (nodeLevel) => getNodeLevelSchema(nodeLevel.id, { transacting }))
  );

  const schemasByLocationName = _.keyBy(schemas, 'locationName');

  return _.map(nodeLevels, (nodeLevel) => ({
    ...nodeLevel,
    schema: schemasByLocationName[`node-level-${nodeLevel.id}`] || null,
  }));
}

module.exports = { nodeLevelsByCurriculum };
