const { LeemonsError } = require('@leemons/error');

const DEFAULT_COLUMNS = ['id', 'current', 'last', 'name', 'status', 'subjects', 'tags', 'asset'];
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

async function getMany({ taskIds, columns, withFiles, ctx }) {
  try {
    return ctx.tx.call('assignables.assignables.getAssignables', {
      ids: taskIds,
      columns,
      withFiles,
    });
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error getting multiple tasks: ${e.message}`,
      cause: e,
    });
  }
}

async function get({ taskId, columns: _columns = DEFAULT_COLUMNS, withFiles, ctx }) {
  try {
    const columns = _columns === '*' ? DEFAULT_COLUMNS : _columns;
    if (Array.isArray(taskId)) {
      return getMany({ taskIds: taskId, columns, withFiles, ctx });
    }

    const result = await getMany({
      taskIds: [taskId],
      columns,
      withFiles,
      ctx,
    });

    return result[0];
  } catch (e) {
    throw new LeemonsError(ctx, {
      message: `Error getting task: ${e.message}`,
    });
  }
}

module.exports = {
  get,
  TASK_VERSIONING_EXISTING_COLUMNS,
  TASK_EXISTING_COLUMNS,
  TASK_VERSIONS_EXISTING_COLUMNS,
  TASK_SUBJECTS_EXISTING_COLUMNS,
};
