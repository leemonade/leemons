// const { instances: instancesTable } = require('../../table');
// const { get: getTask } = require('../../task/get');
// const count = require('../student/count');
// const list = require('../student/list');
// const { DEFAULT_COLUMNS: STATS_COLUMNS, getStats } = require('../student/stats');

// const TASK_COLUMNS_DEFAULT = ['name', 'deadline', 'alwaysOpen'];

// const INSTANCE_COLUMNS = [
//   'startDate',
//   'deadline',
//   'visualizationDate',
//   'executionTime',
//   'message',
//   'status',
//   'alwaysOpen',
//   'closeDate',
//   'showCurriculum',
// ];
// const DEFAULT_COLUMNS = [
//   ...TASK_COLUMNS_DEFAULT,
//   'startDate',
//   'status',
//   'studentCount',
//   ...STATS_COLUMNS,
// ];
const assignablesServices = require('../../assignables');

async function getInstanceTask(instance, { userSession, transacting } = {}) {
  const { assignableInstances } = assignablesServices();

  const assignableInstance = await assignableInstances.getAssignableInstance(instance, {
    transacting,
    userSession,
  });

  return assignableInstance;

  // // EN: Parse the desired columns to only include the ones we want.
  // // ES: Parsea las columnas deseadas para incluir solo las que necesitemos.
  // const instanceColumns =
  //   columns === '*'
  //     ? INSTANCE_COLUMNS
  //     : INSTANCE_COLUMNS.filter((column) => columns.includes(column));

  // const otherColumns = columns.filter((column) => !INSTANCE_COLUMNS.includes(column));

  // const instances = Array.isArray(instance) ? instance : [instance];

  // // EN: Get the related task to each instance
  // // ES: Obtenemos el task relacionado a cada instancia
  // let instanceTasks = await instancesTable.find(
  //   {
  //     id_$in: instances,
  //   },
  //   {
  //     columns: [...instanceColumns, 'task', 'id'],
  //     transacting,
  //   }
  // );

  // instanceTasks = instanceTasks.map((instanceTask) => ({
  //   ...instanceTask,
  //   showCurriculum: instanceTask.showCurriculum ? JSON.parse(instanceTask.showCurriculum) : null,
  // }));

  // // EN: Get the de-duplicated tasks' ids to reduce the number of queries
  // // ES: Obtenemos los ids de los tasks de-duplicados para reducir el número de consultas
  // const tasksIds = [...new Set(instanceTasks.map((i) => i.task))];

  // // EN: Get the tasks info (and save on an object with the id as key to avoid searches)
  // // ES: Obtenemos la información de los tasks (y guardamos en un objeto con el id como clave para evitar búsquedas)
  // const tasks = (await getTask(tasksIds, { columns: otherColumns, transacting })).reduce(
  //   (o, t) => ({ ...o, [t.id]: t }),
  //   {}
  // );

  // // EN: Get the students count for each instance and save it on the instance object
  // // ES: Obtenemos el número de estudiantes para cada instancia y guardamoslo en el objeto de instancia
  // const students = {};

  // if (columns === '*' || columns.includes('studentCount')) {
  //   await Promise.all(
  //     instanceTasks.map(async (i) => {
  //       students[i.id] = {
  //         count: await count(i.id, { transacting }),
  //       };
  //     })
  //   );
  // }

  // // EN: Get the students stats for each instance and save it on the students object
  // // ES: Obtenemos los stats de estudiantes para cada instancia y guardamoslo en el objeto de estudiantes
  // await Promise.all(
  //   instanceTasks.map(async (i) => {
  //     const stats = await getStats(i.id, { columns, transacting });
  //     students[i.id] = {
  //       ...students[i.id],
  //       ...stats,
  //     };
  //   })
  // );

  // // TODO: Get all the students and make info meaningful
  // if (columns === '*' || columns.includes('studentList')) {
  //   await Promise.all(
  //     instanceTasks.map(async (i) => {
  //       students[i.id] = {
  //         ...students[i.id],
  //         list: await list(i.id, 0, 60, { transacting }),
  //       };
  //     })
  //   );
  // }

  // // EN: Group all the info by instance
  // // ES: Agrupamos toda la información por instancia
  // return instanceTasks.map((i) => {
  //   const task = tasks[i.task];

  //   const data = {
  //     ...i,
  //     task,
  //   };

  //   if (students[i.id]) {
  //     data.students = students[i.id];
  //   }

  //   return data;
  // });
}

module.exports = {
  get: getInstanceTask,
  INSTANCE_COLUMNS: [],
};
