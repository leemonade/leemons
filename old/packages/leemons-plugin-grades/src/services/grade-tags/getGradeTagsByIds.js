const _ = require('lodash');
const { table } = require('../tables');

async function getGradeTagsByIds(ids, { transacting } = {}) {
  const tags = await table.gradeTags.find(
    { id_$in: _.isArray(ids) ? ids : [ids] },
    { transacting }
  );
  const scales = await table.gradeScales.find({ id_$in: _.map(tags, 'scale') }, { transacting });
  const scalesByIds = _.keyBy(scales, 'id');
  return _.map(tags, (tag) => ({
    ...tag,
    scale: scalesByIds[tag.scale],
  }));
}

module.exports = { getGradeTagsByIds };
