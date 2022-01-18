const emit = require('../events/emit');
const { tasks } = require('../table');

module.exports = async function create(
  {
    tagline,
    level,
    summary,
    cover,
    color,
    methodology,
    recommendedDuration,
    statement,
    development,
    submissions,
    selfReflection,
    feedback,
    instructionsForTeacher,
    instructionsForStudent,
    state,
    published,
  },
  { transacting } = {}
) {
  let task = {
    tagline,
    level,
    summary,
    cover,
    color,
    methodology,
    recommendedDuration,
    statement,
    development,
    submissions,
    selfReflection,
    feedback,
    instructionsForTeacher,
    instructionsForStudent,
    state,
    published,
  };

  task = await tasks.create(task, { transacting });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit('task.created', { id: task.id });

  return task;
};
