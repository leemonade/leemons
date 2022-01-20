const emit = require('../events/emit');
const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');

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

  let taskInfo = {
    last: '1.0.0',
    current: '1.0.0',
  };

  // EN: Create task versioning instance
  // ES: Crear instancia de versionamiento de tarea
  taskInfo = await tasksVersioning.create(taskInfo, { transacting });

  // EN: Generate an id with the task versioning id and the current version
  // ES: Generar un id con el id de versionamiento de tarea y la versión actual
  // id@version
  const { fullId, id, version } = await parseId(taskInfo.id, taskInfo.current);
  task.id = fullId;

  // EN: Create task instance
  // ES: Crear instancia de tarea
  task = await tasks.create(task, { transacting });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit('task.created', { id: taskInfo.id });

  return { fullId, id, version, current: `${id}@current` };
};
