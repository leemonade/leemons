const { groupBy } = require('lodash');
const { tasksVersioning } = require('../table');
const get = require('./get');
const parseId = require('./helpers/parseId');

module.exports = async function search(query, page = 0, size = 10, { transacting } = {}) {
  try {
    // EN: Get the page x of size y from the tasksVersioning table.
    // ES: Obtener la página x de tamaño y de la tabla tasksVersioning.
    const taskVersions = await global.utils.paginate(
      tasksVersioning,
      page,
      size,
      { id_$null: false, current_$ne: '0.0.0' },
      { transacting }
    );

    // EN: Create a fullId with the id and version so we can search.
    // ES: Crear un fullId con el id y la versión para buscar.
    const tasksIds = await Promise.all(
      taskVersions.items.map(async ({ id, current, ...rest }) => ({
        ...rest,
        id,
        current,
        fullId: (await parseId(id, current, { transacting })).fullId,
      }))
    );

    // EN: Get the tasks by fullId.
    // ES: Obtener las tareas por fullId.
    let tasksData = await get(
      tasksIds.map(({ fullId }) => fullId),
      { columns: ['name', 'tagline', 'summary', 'cover', 'color'], transacting }
    );

    // EN: Group the tasks by fullId and concat both objects.
    // ES: Agrupar las tareas por fullId y concatenar ambos objetos.
    tasksData = Object.values(
      groupBy(
        tasksData.map(({ id, ...task }) => ({ ...task, fullId: id })).concat(tasksIds),
        'fullId'
      )
    ).map(([task, taskVersion]) => ({ ...task, ...taskVersion }));

    return { ...taskVersions, items: tasksData };
  } catch (e) {
    throw new Error(`Error searching task: ${e.message}`);
  }
};
