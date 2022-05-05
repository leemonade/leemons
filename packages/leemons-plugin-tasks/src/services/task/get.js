const assignablesService = require('../assignables');

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
  'preTask',
  'preTaskOptions',
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

async function getMany(taskIds, { columns, userSession, transacting } = {}) {
  const { assignables } = assignablesService;
  try {
    // EN: Get the requested columns
    // ES: Obtener las columnas solicitadas
    // const versioningColumns =
    //   columns === '*'
    //     ? TASK_VERSIONING_EXISTING_COLUMNS
    //     : columns.filter((column) => TASK_VERSIONING_EXISTING_COLUMNS.includes(column));
    // const taskColumns =
    //   columns === '*'
    //     ? TASK_EXISTING_COLUMNS
    //     : columns.filter((column) => TASK_EXISTING_COLUMNS.includes(column));
    // const versionsColumns =
    //   columns === '*'
    //     ? TASK_VERSIONS_EXISTING_COLUMNS
    //     : columns.filter((column) => TASK_VERSIONS_EXISTING_COLUMNS.includes(column));
    // const subjectsColumns =
    //   columns === '*'
    //     ? TASK_SUBJECTS_EXISTING_COLUMNS
    //     : columns.filter((column) => TASK_SUBJECTS_EXISTING_COLUMNS.includes(column));

    // EN: Get each task' id and fullId
    // ES: Obtener cada id y fullId de la tarea
    return taskIds.map((taskId) => assignables.getAssignable(taskId, { userSession, transacting }));

    // TODO: Return attachments
  } catch (e) {
    throw new Error(`Error getting multiple tasks: ${e.message}`);
  }
}

async function get(taskId, { columns = DEFAULT_COLUMNS, userSession, transacting } = {}) {
  try {
    if (Array.isArray(taskId)) {
      return getMany(taskId, { columns, userSession, transacting });
    }

    const result = await getMany([taskId], {
      columns,
      userSession,
      transacting,
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
