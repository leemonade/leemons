const addAssessmentCriteria = require('./add');
const removeAssessmentCriteria = require('./remove');

module.exports = async function setAssessmentCriteria(
  task,
  subject,
  assessmentCriteria,
  { transacting } = {}
) {
  try {
    await removeAssessmentCriteria(task, subject, undefined, { transacting });
    return addAssessmentCriteria(task, subject, assessmentCriteria, { transacting });
  } catch (e) {
    throw new Error(`Error setting assessmentCriteria: ${e.message}`);
  }
};
