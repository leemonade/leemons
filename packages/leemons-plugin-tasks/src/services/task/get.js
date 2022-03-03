const { tasks, tasksVersioning } = require('../table');
const parseId = require('./helpers/parseId');
const getVersion = require('./versions/get');
const getSubjects = require('./subjects/get');
const getTags = require('../tags/get');
const getObjectives = require('./objectives/get');

const DEFAULT_COLUMNS = ['id', 'current', 'last', 'name', 'status', 'subjects', 'tags'];
const TASK_VERSIONING_EXISTING_COLUMNS = ['id', 'name', 'current', 'last'];
const TASK_EXISTING_COLUMNS = [
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
  'center',
  'program',
];
const TASK_VERSIONS_EXISTING_COLUMNS = ['status'];
const TASK_SUBJECTS_EXISTING_COLUMNS = ['subjects'];

async function getMany(taskIds, { columns, transacting } = {}) {
  try {
    // EN: Get the requested columns
    // ES: Obtener las columnas solicitadas
    const versioningColumns =
      columns === '*'
        ? TASK_VERSIONING_EXISTING_COLUMNS
        : columns.filter((column) => TASK_VERSIONING_EXISTING_COLUMNS.includes(column));
    const taskColumns =
      columns === '*'
        ? TASK_EXISTING_COLUMNS
        : columns.filter((column) => TASK_EXISTING_COLUMNS.includes(column));
    const versionsColumns =
      columns === '*'
        ? TASK_VERSIONS_EXISTING_COLUMNS
        : columns.filter((column) => TASK_VERSIONS_EXISTING_COLUMNS.includes(column));
    const subjectsColumns =
      columns === '*'
        ? TASK_SUBJECTS_EXISTING_COLUMNS
        : columns.filter((column) => TASK_SUBJECTS_EXISTING_COLUMNS.includes(column));

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

    // EN: Get the tasks subjects by id (id@version)
    // ES: Obtener las tareas por id (id@version)
    let _subjects;
    if (subjectsColumns.includes('subjects')) {
      _subjects = await getSubjects(fullIds, { transacting });
    }

    let tags;
    if (columns === '*' || columns.includes('tags')) {
      tags = await fullIds.reduce(async (accum, id) => {
        await accum;
        const t = await getTags(id, { transacting });

        return {
          ...accum,
          [id]: t.tags,
        };
      }, {});
    }

    let objectives;
    if (columns === '*' || columns.includes('objectives')) {
      objectives = await fullIds.reduce(async (accum, id) => {
        await accum;
        const o = await getObjectives(id, { transacting });

        return {
          ...accum,
          [id]: o.objectives,
        };
      }, {});
    }

    // EN: Map the tasks by id
    // ES: Mapear las tareas por id
    return Promise.all(
      ids.map(async (id, i) => {
        const t = {
          ...versioning.find(({ id: _id }) => id === _id),
          ..._tasks.find(({ id: _id }) => _id === fullIds[i]),
        };
        if (subjectsColumns.includes('subjects')) {
          t.subjects = _subjects[t.id] || [];
        }

        if (versionsColumns.length) {
          t.status = (await getVersion(fullIds[i], { transacting })).status;
        }

        if (tags) {
          t.tags = tags[fullIds[i]];
        }

        if (objectives) {
          t.objectives = objectives[fullIds[i]];
        }

        return t;
      })
    );
  } catch (e) {
    throw new Error(`Error getting multiple tasks: ${e.message}`);
  }
}

async function get(taskId, { columns = DEFAULT_COLUMNS, transacting } = {}) {
  try {
    if (Array.isArray(taskId)) {
      return getMany(taskId, { columns, transacting });
    }

    const result = await getMany([taskId], {
      columns,
    });

    return result[0];
  } catch (e) {
    throw new Error(`Error getting task: ${e.message}`);
  }
}

module.exports = {
  get,
  TASK_VERSIONING_EXISTING_COLUMNS,
  TASK_EXISTING_COLUMNS,
  TASK_VERSIONS_EXISTING_COLUMNS,
  TASK_SUBJECTS_EXISTING_COLUMNS,
};
