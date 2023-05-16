const emit = require('../../events/emit');
const { taskObjectives: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function removeObjectives(task, subject, objectives, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });
  const _objectives = Array.isArray(objectives) ? objectives : [objectives];
  const _subjects = Array.isArray(subject) ? subject : [subject];

  const query = {
    task: id,
  };

  if (subject && _subjects?.length) {
    query.subject_$in = _subjects;
  }

  if (objectives && _objectives?.length) {
    query.objectives_$in = _objectives;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.objetive.removed', `task.${id}.objetive.removed`], {
    id,
    subject,
    objectives: _objectives,
  });

  return deleted;
};
