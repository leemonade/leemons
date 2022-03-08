const addAssessmentCriteria = require('./add');
const removeAssessmentCriteria = require('./remove');

module.exports = async function setAssessmentCriteria(
  task,
  assessmentCriteria,
  { transacting } = {}
) {
  try {
    await removeAssessmentCriteria(task, undefined, { transacting });
    return addAssessmentCriteria(task, assessmentCriteria, { transacting });
  } catch (e) {
    throw new Error(`Error setting assessmentCriteria: ${e.message}`);
  }
};
