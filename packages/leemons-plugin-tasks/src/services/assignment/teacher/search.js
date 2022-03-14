const { teacherInstances, instances, tasksVersioning } = require('../../table');
const { search } = require('../../../helpers/search');
const parseId = require('../../task/helpers/parseId');

// EN: Get the tasks you have been assigned to (order by assignment date)
// ES: Obtener las tareas que tienes asignadas (ordenar por fecha de asignación)
async function getTeacherTasks(tasks, { teacher, offset, size } = {}, { transacting } = {}) {
  const query = {
    id_$null: false,
    $offset: offset,
    $limit: size,
    $sort: 'created_at:DESC',
  };

  if (teacher) {
    if (Array.isArray(teacher)) {
      query.teacher_$in = teacher;
    } else {
      query.teacher = teacher;
    }
  }

  const result = (
    await teacherInstances.find(query, { columns: ['instance', 'created_at'], transacting })
  ).map((task, i) => ({
    id: task.instance,
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

// EN: Filter by assignmentDate or deadline and by status
// ES: Filtrar por fecha de asignación o fecha de vencimiento y por estado
async function filterByInstanceAttributes(
  results,
  { assignmentDate, deadline, status } = {},
  { transacting } = {}
) {
  if (!results.count) {
    return results;
  }

  const query = {
    id_$in: results.items.map((task) => task.id),
  };

  if (status) {
    query.status = status;
  }

  if (deadline) {
    if (deadline[0] === '[') {
      [query.deadline_$gte, query.deadline_$lte] = JSON.parse(deadline).map((d) =>
        global.utils.sqlDatetime(d)
      );
    } else {
      query.deadline = global.utils.sqlDatetime(deadline);
    }
  }

  if (assignmentDate) {
    if (assignmentDate[0] === '[') {
      [query.created_at_$gte, query.created_at_$lte] = JSON.parse(assignmentDate).map((d) =>
        global.utils.sqlDatetime(d)
      );
    } else {
      query.created_at = global.utils.sqlDatetime(assignmentDate);
    }
  }

  const tasks = await instances.find(query, {
    columns: ['task', 'id'],
    transacting,
  });

  const items = results.items
    .map((task) => {
      const instance = tasks.find((t) => t.id === task.id);

      if (!instance) {
        return undefined;
      }

      return {
        ...task,
        task: instance.task,
      };
    })
    .filter((task) => task);

  return {
    ...results,
    items,
    count: items.length,
  };
}

// EN: Filter by task name
// ES: Filtrar por nombre de tarea
async function filterByTaskAttributes(tasks, { name } = {}, { transacting } = {}) {
  if (!tasks.count) {
    return tasks;
  }

  const tasksItems = await Promise.all(
    tasks.items.map(async (task) => ({ ...task, taskId: (await parseId(task.task)).id }))
  );

  const query = {
    id_$in: tasksItems.map((t) => t.taskId),
  };

  if (name) {
    query.name_$contains = name;
  }

  if (Object.keys(query).length === 1) {
    return tasks;
  }

  const result = await tasksVersioning.find(query, { columns: ['id'], transacting });

  const items = tasksItems.filter((task) => {
    const found = result.find((t) => t.id === task.taskId);

    return !!found;
  });

  return {
    ...tasks,
    items,
    count: items.length,
  };
}

module.exports = async function searchInstance(query, offset, size, { transacting } = {}) {
  const tasks = await search(
    [getTeacherTasks, filterByInstanceAttributes, filterByTaskAttributes],
    query,
    offset,
    size,
    {
      transacting,
    }
  );

  return tasks;
};
