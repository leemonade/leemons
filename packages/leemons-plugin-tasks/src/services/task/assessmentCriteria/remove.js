const emit = require('../../events/emit');
const { taskAssessmentCriteria: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function removeAssessmentCriteria(
  task,
  subject,
  assessmentCriterias,
  { transacting } = {}
) {
  const { fullId } = await parseId(task, null, { transacting });

  const _criterias = Array.isArray(assessmentCriterias)
    ? assessmentCriterias
    : [assessmentCriterias];

  const _subjects = Array.isArray(subject) ? subject : [subject];

  const query = {
    task: fullId,
  };

  if (subject && _subjects?.length) {
    query.subject_$in = _subjects;
  }

  if (assessmentCriterias && _criterias?.length) {
    query.assessmentCriteria_$in = _criterias;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.assessmentCriteria.removed', `task.${fullId}.assessmentCriteria.removed`], {
    id: fullId,
    subject,
    assessmentCriteria: _criterias,
  });

  return deleted;
};
