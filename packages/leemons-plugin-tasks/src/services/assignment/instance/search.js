const { teacherInstances, userInstances, instances, tasksVersioning } = require('../../table');
const { search } = require('../../../helpers/search');
const parseId = require('../../task/helpers/parseId');
const getGroups = require('../groups/get');
const getGroupDetails = require('../groups/groups/get');
const { get: getInstance } = require('./get');
const getProfile = require('../../profiles/get');

// EN: Get the tasks you have been assigned to (order by assignment date)
// ES: Obtener las tareas que tienes asignadas (ordenar por fecha de asignación)
async function getStudentTasks(tasks, { user, offset, size } = {}, { transacting } = {}) {
  const query = {
    id_$null: false,
    $offset: offset,
    $limit: size,
    $sort: 'created_at:DESC',
  };

  if (user) {
    if (Array.isArray(user)) {
      query.user_$in = user;
    } else {
      query.user = user;
    }
  }

  const result = (
    await userInstances.find(query, { columns: ['instance', 'created_at'], transacting })
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

// EN: Get the tasks you have been assigned to (order by assignment date)
// ES: Obtener las tareas que tienes asignadas (ordenar por fecha de asignación)
async function getTeacherTasks(tasks, { user, offset, size } = {}, { transacting } = {}) {
  const query = {
    id_$null: false,
    $offset: offset,
    $limit: size,
    $sort: 'created_at:DESC',
  };

  if (user) {
    if (Array.isArray(user)) {
      query.teacher_$in = user;
    } else {
      query.teacher = user;
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
  { assignmentDate, deadline, status, ...searchParams } = {},
  { transacting } = {}
) {
  if (!results.count) {
    return results;
  }

  const showClosed =
    typeof searchParams.showClosed === 'boolean'
      ? searchParams.showClosed
      : searchParams.showClosed === 'true';
  let hideClosed;

  if (searchParams.hideClosed === undefined) {
    hideClosed = !showClosed;
  } else {
    hideClosed =
      typeof searchParams.hideClosed === 'boolean'
        ? searchParams.hideClosed
        : searchParams.hideClosed === 'true';
  }
  const hideOpened =
    typeof searchParams.hideOpened === 'boolean'
      ? searchParams.hideOpened
      : searchParams.hideOpened === 'true';

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

  if (!showClosed && hideClosed && hideOpened) {
    query.id_$null = true;
  }

  if (!showClosed && hideClosed) {
    query.$or = [
      { closeDate_$gte: global.utils.sqlDatetime(new Date()) },
      {
        closeDate_$null: true,
      },
    ];
  } else if (hideOpened) {
    query.closeDate_$lt = global.utils.sqlDatetime(new Date());
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

// EN: Filter by subject and group
// ES: Filtrar por asignatura y grupo
async function filterBySubjectAndGroup(tasks, { subject, group } = {}, { transacting } = {}) {
  if (!tasks.count) {
    return tasks;
  }

  const query = {
    id_$in: tasks.items.map((task) => task.id),
  };

  if (subject) {
    query.subject = subject;
  }

  if (group) {
    query.group = group;
  }

  let { items } = tasks;

  // EN: Get groups of each task
  // ES: Obtener los grupos de cada tarea
  if (group) {
    items = (
      await Promise.all(
        items.map(async (task) => {
          const groups = await getGroups(task.id, { transacting });

          if (groups.includes(group)) {
            return { ...task, groups };
          }

          return null;
        })
      )
    ).filter(Boolean);
  }

  if (subject) {
    items = (
      await Promise.all(
        items.map(async (task) => {
          const groups = task.groups || (await getGroups(task.id, { transacting }));

          const groupDetails = await getGroupDetails(groups, { transacting });

          if (groupDetails.map((g) => g.subject).includes(subject)) {
            return task;
          }

          return null;
        })
      )
    ).filter(Boolean);
  }

  return {
    ...tasks,
    items,
    count: items.length,
  };
}

module.exports = async function searchInstance(user, query, offset, size, { transacting } = {}) {
  const { getRoleProfile } = leemons.getPlugin('users').services.roles;
  const teacherProfile = await getProfile('teacher', { transacting });
  const studentProfile = await getProfile('student', { transacting });
  let profiles = [...new Set(await Promise.all(user.map(({ role }) => getRoleProfile(role))))];

  profiles = profiles
    .map((profile) => {
      let type = null;

      if (profile === teacherProfile) {
        type = 'teacher';
      } else if (profile === studentProfile) {
        type = 'student';
      }
      return {
        profile,
        type,
      };
    })
    .filter(({ type }) => type);

  if (!profiles?.length) {
    throw new Error('No profiles found');
  }

  // Check if all the profiles are of the same type
  if (
    profiles.length > 1 &&
    profiles.map((p) => p.type).some((type) => type !== profiles[0].type)
  ) {
    throw new Error('You can not search for tasks of different profiles');
  }

  const profile = profiles[0]?.type;

  const tasks = await search(
    [
      profile === 'teacher' ? getTeacherTasks : getStudentTasks,
      filterByInstanceAttributes,
      filterByTaskAttributes,
      filterBySubjectAndGroup,
    ],
    {
      ...query,
      user: user.map((u) => u.id),
    },
    offset,
    size,
    {
      transacting,
    }
  );

  const results = await getInstance(
    tasks.items.map(({ id }) => id),
    { transacting }
  );
  return {
    ...tasks,
    items: results,
    profile,
  };
};
