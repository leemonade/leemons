const emit = require('../../events/emit');
const { taskAssessmentCriteria: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function removeAssessmentCriteria(
  task,
  assessmentCriterias,
  { transacting } = {}
) {
  const { id } = await parseId(task, null, { transacting });
  const _criterias = Array.isArray(assessmentCriterias)
    ? assessmentCriterias
    : [assessmentCriterias];

  const query = {
    task: id,
  };

  if (assessmentCriterias && _criterias?.length) {
    query.assessmentCriteria_$in = _criterias;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.assessmentCriteria.removed', `task.${id}.assessmentCriteria.removed`], {
    id,
    assessmentCriteria: _criterias,
  });

  return deleted;
};
