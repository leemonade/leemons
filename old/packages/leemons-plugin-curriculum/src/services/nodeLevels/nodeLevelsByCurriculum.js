const _ = require('lodash');
const { table } = require('../tables');
const { getNodeLevelSchema } = require('./getNodeLevelSchema');

async function nodeLevelsByCurriculum(ids, { transacting } = {}) {
  const [nodeLevels, curriculums] = await Promise.all([
    table.nodeLevels.find({ curriculum_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
    table.curriculums.find({ id_$in: _.isArray(ids) ? ids : [ids] }, { transacting }),
  ]);

  const curriculumsById = _.keyBy(curriculums, 'id');

  const schemas = await Promise.all(
    _.map(nodeLevels, (nodeLevel) =>
      getNodeLevelSchema(nodeLevel.id, curriculumsById[nodeLevel.curriculum].locale, {
        transacting,
      })
    )
  );

  const schemasByLocationName = _.keyBy(schemas, 'locationName');

  return _.map(nodeLevels, (nodeLevel) => ({
    ...nodeLevel,
    schema: schemasByLocationName[`node-level-${nodeLevel.id}`] || null,
  }));
}

module.exports = { nodeLevelsByCurriculum };
