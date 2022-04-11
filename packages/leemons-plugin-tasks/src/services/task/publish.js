const emit = require('../events/emit');
const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');
const { get: getTask } = require('./get');

module.exports = async function publish(taskId, { transacting: t } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      try {
        // EN: Get the id from complete id@version
        // ES: Obtener el id de la id@version completa
        const { id, fullId, version } = await parseId(taskId, null, { transacting });

        // EN: Get the task
        // ES: Obtener la tarea
        const taskToUpdate = await getTask(fullId, {
          columns: ['name', 'tagline', 'summary', 'content', 'objectives', 'statement'],
          transacting,
        });
        // const [taskToUpdate] = await tasks.find({ id: fullId }, { transacting });

        if (!taskToUpdate) {
          throw new Error('Task not found');
        }

        const validator = new global.utils.LeemonsValidator({
          type: 'object',
          properties: {
            name: {
              type: 'string',
              minLength: 1,
            },
            tagline: {
              type: 'string',
              minLength: 1,
            },
            summary: {
              type: 'string',
              minLength: 1,
            },
            content: {
              type: 'array',
              minItems: 1,
            },
            objectives: {
              type: 'array',
              minItems: 1,
            },
            statement: {
              type: 'string',
              minLength: 1,
            },
          },
          required: ['name', 'tagline', 'summary', 'content', 'objectives', 'statement'],
        });

        if (!validator.validate(taskToUpdate)) {
          throw new global.utils.HttpError(400, 'The task is incomplete');
        }

        // EN: Throw if the task is already published
        // ES: Lanzar si la tarea ya está publicada
        if (taskToUpdate.published) {
          throw new Error('Task already published');
        }

        // EN: Update the task versioning
        // ES: Actualizar el versionado de la tarea
        await tasksVersioning.set({ id }, { current: version }, { transacting });

        // EN: Update the task
        // ES: Actualizar la tareas
        await tasks.set(
          { id: fullId },
          { published: true },
          {
            transacting,
          }
        );

        // EN: Emit the event.
        // ES: Emitir el evento.
        emit(['task.published', `task.${id}.published`], { id, version });

        return {
          id,
          version,
          fullId,
          published: true,
        };
      } catch (e) {
        throw new Error(`Error publishing task: ${e.message}`);
      }
    },
    tasks,
    t
  );
};
