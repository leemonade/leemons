// TODO: ADD PERMISSIONS

const { tasksVersioning, tasksVersions, tasks: tasksTable, taskSubjects } = require('../table');
const { get } = require('./get');
const parseId = require('./helpers/parseId');

async function getTasks({ name } = {}, offset, size, { transacting } = {}) {
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

async function getLatestVersion(tasks, draft, { transacting } = {}) {
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

async function filterBySubject(tasks, { subject, level } = {}, { transacting } = {}) {
  const query = {
    task_$in: tasks.items.map((task) => task.id),
  };

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

async function unfitSearch(query, offset, size, { draft = false, tasks: t, transacting } = {}) {
  try {
    /**
     * First: Get the tasks filtered by name
     * Second: Get the latest (published or draft) version of each task
     * Third: Filter task@version by direct params
     * Fourch: Filter by multi-table params
     */

    // EN: Firstly, get the tasks filtered by name
    // ES: Primero, obtener las tareas filtradas por nombre
    let tasks = await getTasks(query, offset, size, { transacting });

    // EN: Secondly, get the latest (published or draft) version of each task
    // ES: Segundo, obtener la versión más reciente (publicada o borrador) de cada tarea
    tasks = await getLatestVersion(tasks, draft, { transacting });

    // EN: Thirdly, filter the tasks by simple params
    // ES: Tercero, filtrar las tareas por parámetros simples
    tasks = await filterByAttributes(tasks, query, { transacting });

    // EN: Fourthly, filter the tasks by subject params
    // ES: Cuarto, filtrar las tareas por parámetros de asignatura
    tasks = await filterBySubject(tasks, query, { transacting });

    if (t) {
      // EN: Return the tasks, if previous tasks were provided, use their offset, since it's the original one, and concat bow items
      // ES: Devolver las tareas, si las tareas previas fueron proporcionadas, usar su offset, pues es el original, y concatenar los items
      const finalTasks = {
        ...tasks,
        offset: t?.offset !== undefined ? t.offset : tasks.offset,
        items: t.items.concat(tasks.items),
        count: t.count + tasks.count,
      };

      // EN: In some cases, the final tasks can be greater than the size, so we need to limit them and adjust some values. The new nextOffset is the offset of the first discarded item, since the previous offsets are either included or do not match the query.
      // ES: En algunos casos, las tareas finales pueden ser mayores que el tamaño, así que necesitamos limitarlas y ajustar algunos valores. El nuevo nextOffset es el offset del primer elemento descartado, ya que los offsets anteriores estan o bien incluidos, o bien no coinciden con la consulta.
      if (finalTasks.count > size) {
        const unusedItems = finalTasks.items.splice(size);
        finalTasks.items.length = size;
        finalTasks.count = size;
        finalTasks.canGoNext = true;
        // EN: Add a check of the certainty of the next page, so we don't need the security query.
        // ES: Añadir una verificación de la certeza de una siguiente página, para así no necesitar la consulta de seguridad.
        finalTasks.canGoNextCertainity = true;
        finalTasks.nextOffset = unusedItems[0].offset;
      }

      return finalTasks;
    }

    return tasks;
  } catch (e) {
    throw new Error(`Error searching task: ${e.message}`);
  }
}

module.exports = async function search(
  query,
  offset = 0,
  size = 10,
  { draft = false, verifyNextPage = true, details = true, transacting } = {}
) {
  try {
    let tasks;
    let i = 0;

    // EN: While the tasks are less than the size and a new page exists, keep searching, so we always return the queried size
    // ES: Mientras las tareas sean menores que el tamaño y exista una nueva página, seguimos buscando, así que siempre devolvemos el tamaño solicitado
    do {
      // eslint-disable-next-line no-await-in-loop
      tasks = await unfitSearch(query, tasks?.nextOffset || offset, size, {
        tasks,
        draft,
        transacting,
      });

      i++;
    } while (tasks.count < size && tasks.canGoNext);

    tasks.iterations = i;

    // EN: As the tasks are searched across multiple tables, we need to check that the existance of a next page is real, so we can search the next value to be sure that the next page exists, also, we can adjust the nextOffset to be the offset of the returned item.
    // ES: Como las tareas se buscan en múltiples tablas, necesitamos comprobar que existe una siguiente página, así que podemos buscar el siguiente valor para asegurarnos de que existe la siguiente página, también, podemos ajustar el nextOffset para ser el offset del elemento devuelto.
    if (verifyNextPage && tasks.canGoNext && !tasks.canGoNextCertainity) {
      const nextItem = await search(query, tasks.nextOffset, 1, {
        draft,
        verifyNextPage: false,
        details: false,
        transacting,
      });
      tasks.canGoNext = nextItem.count > 0;
      tasks.nextOffset = nextItem.items[0]?.offset;
    }

    if (tasks.canGoNextCertainity) {
      tasks.canGoNextCertainity = undefined;
    }

    if (!details) {
      return tasks;
    }

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
  } catch (e) {
    throw new Error(`Error searching task: ${e.message}`);
  }
};
