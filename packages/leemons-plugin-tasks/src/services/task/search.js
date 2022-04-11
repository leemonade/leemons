// TODO: ADD PERMISSIONS

const { search } = require('../../helpers/search');
const { tasksVersioning, tasksVersions, tasks: tasksTable, taskSubjects } = require('../table');
const { get } = require('./get');
const parseId = require('./helpers/parseId');

async function getTasks(tasks, { name, offset, size } = {}, { transacting } = {}) {
  const query = {
    id_$null: false,
    $offset: offset,
    $limit: size,
    $sort: 'created_at:DESC',
  };

  if (name) {
    query.name_$contains = name;
  }

  const result = (
    await tasksVersioning.find(query, { columns: ['id', 'created_at'], transacting })
  ).map((task, i) => ({
    ...task,
    offset: offset + i,
  }));
  const count = result.length;

  return {
    items: result,
    count,
    size,
    offset,
    nextOffset: offset + count,
    canGoNext: count === size,
  };
}

async function getLatestVersion(tasks, { draft } = {}, { transacting } = {}) {
  const items = (
    await Promise.all(
      tasks.items.map(async (task) => {
        const query = {
          task: task.id,
          status: draft ? 'draft' : 'published',
          $sort: 'major:DESC,minor:DESC,patch:DESC',
          $limit: 1,
        };

        const result = await tasksVersions.find(query, { transacting });

        if (!result.length) {
          return null;
        }

        const version = `${result[0].major}.${result[0].minor}.${result[0].patch}`;

        const { fullId } = await parseId(task.id, version);

        return {
          ...task,
          version,
          id: fullId,
        };
      })
    )
  ).filter((task) => task);

  return {
    ...tasks,
    items,
    count: items.length,
  };
}

async function filterByAttributes(
  tasks,
  { methodology, center, program } = {},
  { transacting } = {}
) {
  const query = {
    id_$in: tasks.items.map((task) => task.id),
  };

  if (methodology) {
    query.methodology = methodology;
  }

  if (center) {
    query.center = center;
  }

  if (program) {
    query.program = program;
  }

  if (!tasks.items.length || Object.keys(query).length === 1) {
    return tasks;
  }

  const result = await tasksTable.find(query, { columns: ['id'], transacting });

  const items = tasks.items.filter((task) => result.find(({ id }) => id === task.id));
  return {
    ...tasks,
    items,
    count: items.length,
  };
}

async function filterBySubject(tasks, { subject, level, course } = {}, { transacting } = {}) {
  const query = {
    task_$in: tasks.items.map((task) => task.id),
  };

  if (course) {
    query.course = course;
  }

  if (subject) {
    query.subject = subject;
  }

  if (level) {
    query.level = level;
  }

  if (Object.keys(query).length === 1) {
    return tasks;
  }

  const result = await taskSubjects.find(query, { columns: ['task'], transacting });

  const items = tasks.items.filter((task) => result.find(({ task: taskId }) => taskId === task.id));

  return {
    ...tasks,
    items,
    count: items.length,
  };
}

module.exports = async function searchTask(query, offset, size, { draft, transacting } = {}) {
  const tasks = await search(
    [getTasks, getLatestVersion, filterByAttributes, filterBySubject],
    {
      ...query,
      draft,
    },
    offset,
    size,
    { transacting }
  );

  // EN: Get the task info for each result
  // ES: Obtener la información de la tarea para cada resultado
  const taskInfo = await get(
    tasks.items.map((task) => task.id),
    { columns: ['name', 'tagline', 'summary', 'cover', 'color', 'tags'], transacting }
  );

  return {
    ...tasks,
    items: taskInfo,
  };
};
