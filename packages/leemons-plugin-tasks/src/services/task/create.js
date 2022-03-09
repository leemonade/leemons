const emit = require('../events/emit');
const { tasks } = require('../table');
const parseId = require('./helpers/parseId');
const addSubjects = require('./subjects/add');
const versioningCreate = require('./versions/create');
const addTags = require('../tags/add');
const addObjectives = require('./objectives/add');
const addAssessmentCriteria = require('./assessmentCriteria/add');
const addContent = require('./contents/add');
const addAttachments = require('../attachments/add');

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
    preTask,
    preTaskOptions,
    selfReflection,
    selfReflectionDescription,
    feedback,
    instructionsForTeacher,
    instructionsForStudent,
    state,
    subjects,
    center,
    program,
    tags,
    objectives,
    content,
    assessmentCriteria,
    attachments,
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
          preTask,
          preTaskOptions: preTaskOptions && JSON.stringify(preTaskOptions),
          selfReflection,
          selfReflectionDescription,
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

        // EN: Add assessment criteria
        // ES: Añadir criterios de evaluación
        await addAssessmentCriteria(task.id, assessmentCriteria, { transacting });

        // EN: Add content
        // ES: Añadir contenido
        await addContent(task.id, content, { transacting });

        // EN: Add attachments
        // ES: Añadir adjuntos
        await addAttachments(task.id, attachments, { transacting });

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
