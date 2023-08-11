const assignablesServices = require('../assignables');

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
  'gradable',
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

async function getMany(taskIds, { withFiles, userSession, transacting } = {}) {
  const { assignables } = assignablesServices();

  try {
    return assignables.getAssignables(taskIds, { userSession, withFiles, transacting });
  } catch (e) {
    throw new Error(`Error getting multiple tasks: ${e.message}`, { cause: e });
  }
}

async function get(
  taskId,
  { columns = DEFAULT_COLUMNS, userSession, withFiles, transacting } = {}
) {
  try {
    if (Array.isArray(taskId)) {
      return getMany(taskId, { columns, userSession, withFiles, transacting });
    }

    const result = await getMany([taskId], {
      columns,
      userSession,
      transacting,
      withFiles,
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
