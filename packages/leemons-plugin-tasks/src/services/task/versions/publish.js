const { tasksVersions, tasksVersioning } = require('../../table');
const get = require('./get');
const parseId = require('../helpers/parseId');
const { get: getTask } = require('../get');

module.exports = async function publishVersion(taskId, { setCurrent = false, transacting } = {}) {
  const { id, version, fullId } = await parseId(taskId, null, { transacting });

  // EN: Get task version
  // ES: Obtener la versión de la tarea
  const task = await get(fullId, { transacting });

  // EN: Throw if the task is already published
  // ES: Lanzar si la tarea ya está publicada
  if (task.published) {
    throw new Error('Task already published');
  }

  // EN: Get the task
  // ES: Obtener la tarea
  const taskToUpdate = await getTask(fullId, {
    columns: ['name', 'tagline', 'summary', 'content', 'objectives', 'statement'],
    transacting,
  });

  if (!taskToUpdate || !task) {
    throw new Error(`Task ${task} does not exist`);
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
      statement: {
        type: 'string',
        minLength: 1,
      },
    },
    required: ['name', 'tagline', 'summary', 'statement'],
  });

  if (!validator.validate(taskToUpdate)) {
    throw new global.utils.HttpError(400, 'The task is incomplete');
  }

  if (task.status === 'published') {
    throw new Error(`Task ${task} is already published`);
  }

  await tasksVersions.set({ id: task.id }, { status: 'published' });

  if (setCurrent) {
    await tasksVersioning.set({ id }, { current: version });
  }
};
