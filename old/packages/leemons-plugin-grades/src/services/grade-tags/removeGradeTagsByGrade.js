const _ = require('lodash');
const { table } = require('../tables');

async function removeGradeTagsByGrade(grade, { transacting } = {}) {
  const gradeTags = await table.gradeTags.find(
    { grade_$in: _.isArray(grade) ? grade : [grade] },
    { transacting }
  );

  const gradeTagIds = _.map(gradeTags, 'id');

  await leemons.events.emit('before-remove-grade-tags', { gradeTags, transacting });

  await table.gradeTags.deleteMany({ id_$in: gradeTagIds }, { transacting });

  await leemons.events.emit('after-remove-grade-tags', { gradeTags, transacting });

  return true;
}

module.exports = { removeGradeTagsByGrade };
