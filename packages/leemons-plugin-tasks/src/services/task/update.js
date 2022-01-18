const emit = require('../events/emit');
const { tasks } = require('../table');

module.exports = async function update(
  id,
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
  const task = {
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

  const newTask = await tasks.set({ id }, task, { transacting });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.updated', `task.${id}.updated`], { id, changes: task });

  return newTask;
};
