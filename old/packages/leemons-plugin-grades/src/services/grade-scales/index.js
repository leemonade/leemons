const { addGradeScale } = require('./addGradeScale');
const { updateGradeScale } = require('./updateGradeScale');
const { removeGradeScale } = require('./removeGradeScale');
const { canRemoveGradeScale } = require('./canRemoveGradeScale');
const { getGradeScalesByGrade } = require('./getGradeScalesByGrade');

module.exports = {
  addGradeScale,
  updateGradeScale,
  removeGradeScale,
  canRemoveGradeScale,
  getGradeScalesByGrade,
};
