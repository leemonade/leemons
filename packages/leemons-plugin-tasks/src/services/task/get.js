const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');

const taskVersioningExistingColumns = ['id', 'name', 'current', 'last'];
const taskExistingColumns = [
  'tagline',
  'level',
  'summary',
  'cover',
  'color',
  'methodology',
  'recommendedDuration',
  'statement',
  'development',
  'submissions',
  'selfReflection',
  'feedback',
  'instructionsForTeacher',
  'instructionsForStudent',
  'state',
  'published',
];

async function getMany(taskIds, { versioningColumns, taskColumns, transacting } = {}) {
  try {
    // EN: Get each task' id and fullId
    // ES: Obtener cada id y fullId de la tarea
    const [ids, fullIds] = await taskIds.reduce(
      async (accum, taskId) => {
        const [_ids, _fullIds] = await accum;
        const { fullId, id } = await parseId(taskId, null, { transacting });
        return [
          [..._ids, id],
          [..._fullIds, fullId],
        ];
      },
      [[], []]
    );

    // EN: Get the name of each task (in taskVersioning)
    // ES: Obtener el nombre de cada tarea (en taskVersioning)
    const versioning = await tasksVersioning.find(
      { id_$in: ids },
      { columns: ['id', ...versioningColumns], transacting }
    );

    // EN: Get the tasks by id (id@version)
    // ES: Obtener las tareas por id (id@version)
    const _tasks = await tasks.find(
      { id_$in: fullIds },
      { columns: ['id', ...taskColumns], transacting }
    );

    // EN: Map the tasks by id
    // ES: Mapear las tareas por id
    return ids.map((id, i) => ({
      ...versioning.find(({ id: _id }) => id === _id),
      ..._tasks.find(({ id: _id }) => _id === fullIds[i]),
    }));
  } catch (e) {
    throw new Error(`Error getting multiple tasks: ${e.message}`);
  }
}

module.exports = async function get(
  taskId,
  { columns = ['id', 'current', 'last', 'name'], transacting } = {}
) {
  try {
    // EN: Get the requested columns
    // ES: Obtener las columnas solicitadas
    const versioningColumns = columns.filter((column) =>
      taskVersioningExistingColumns.includes(column)
    );
    const taskColumns = columns.filter((column) => taskExistingColumns.includes(column));
    if (Array.isArray(taskId)) {
      return getMany(taskId, { versioningColumns, taskColumns, transacting });
    }

    const { fullId, id } = await parseId(taskId, null, { transacting });
    // EN: Get the name from the task (in taskVersioning)
    // ES: Obtener el nombre de la tarea (en taskVersioning)
    const [versioning] = await tasksVersioning.find(
      { id },
      { columns: versioningColumns, transacting }
    );
    // EN: Get task by id (id@version).
    // ES: Obtener tarea por id (id@version).
    const task = await tasks.find({ id: fullId }, { columns: taskColumns, transacting });

    return task.length ? { ...task[0], ...versioning } : null;
  } catch (e) {
    throw new Error(`Error getting task: ${e.message}`);
  }
};
