const _ = require('lodash');
const { getNodeLevelSchema } = require('./getNodeLevelSchema');

async function nodeLevelsByCurriculum({ ids, ctx }) {
  const [nodeLevels, curriculums] = await Promise.all([
    ctx.tx.db.NodeLevels.find({ curriculum: _.isArray(ids) ? ids : [ids] }).lean(),
    ctx.tx.db.Curriculums.find({ id: _.isArray(ids) ? ids : [ids] }).lean(),
  ]);

  const curriculumsById = _.keyBy(curriculums, 'id');

  const schemas = await Promise.all(
    _.map(nodeLevels, (nodeLevel) =>
      getNodeLevelSchema({
        nodeLevelId: nodeLevel.id,
        locale: curriculumsById[nodeLevel.curriculum].locale,
        ctx,
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
