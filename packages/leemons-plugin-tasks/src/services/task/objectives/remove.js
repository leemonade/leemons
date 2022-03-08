const emit = require('../../events/emit');
const { taskObjectives: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function removeObjectives(task, objectives, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });
  const _objectives = Array.isArray(objectives) ? objectives : [objectives];

  const query = {
    task: id,
  };

  if (objectives && _objectives?.length) {
    query.objectives_$in = _objectives;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.objetive.removed', `task.${id}.objetive.removed`], { id, objectives: _objectives });

  return deleted;
};
