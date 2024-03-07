const { addGradeTag } = require('./addGradeTag');
const { updateGradeTag } = require('./updateGradeTag');
const { removeGradeTag } = require('./removeGradeTag');
const { getGradeTagsByIds } = require('./getGradeTagsByIds');
const { getGradeTagsByGrade } = require('./getGradeTagsByGrade');

module.exports = {
  addGradeTag,
  updateGradeTag,
  removeGradeTag,
  getGradeTagsByIds,
  getGradeTagsByGrade,
};
