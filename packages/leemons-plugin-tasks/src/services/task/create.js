const emit = require('../events/emit');
const { tasks } = require('../table');
const parseId = require('./helpers/parseId');
const addSubjects = require('./subjects/add');
const versioningCreate = require('./versions/create');
const addTags = require('../tags/add');
const addObjectives = require('./objectives/add');

module.exports = async function create(
  {
    name,
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
    subjects,
    center,
    program,
    tags,
    objectives,
  },
  { transacting: t } = {}
) {
  try {
    return global.utils.withTransaction(
      async (transacting) => {
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
          published: false,
          center,
          program,
        };

        // EN: Register task versioning
        // ES: Registrar versionado de tarea
        const taskInfo = await versioningCreate(
          {
            name,
          },
          { transacting }
        );

        // EN: Generate an id with the task versioning id and the current version
        // ES: Generar un id con el id de versionamiento de tarea y la versión actual
        // id@version
        const { fullId, id, version } = await parseId(taskInfo.id, taskInfo.last, { transacting });
        task.id = fullId;

        // EN: Create task instance
        // ES: Crear instancia de tarea
        task = await tasks.create(task, { transacting });

        // EN: Create task subjects
        // ES: Crear asignaturas de tarea
        await addSubjects(task.id, subjects, { transacting });

        // EN: Create the task tags
        // ES: Crear etiquetas de tarea
        await addTags(task.id, tags, { transacting });

        // EN: Add objectives
        // ES: Añadir objetivos
        await addObjectives(task.id, objectives, { transacting });

        // EN: Emit the event.
        // ES: Emitir el evento.
        emit('task.created', { id: taskInfo.id });

        return { name, fullId, id, version, current: `${id}@current` };
      },
      tasks,
      t
    );
  } catch (error) {
    throw new Error(`Error creating task: ${error.message}`);
  }
};
