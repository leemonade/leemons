const { get } = require('./get');
const parseId = require('./helpers/parseId');
const list = require('./versions/list');

module.exports = async function search(
  query,
  page = 0,
  size = 10,
  { draft = false, transacting } = {}
) {
  try {
    // EN: Get the last version of each task (with Pagination)
    // ES: Obtener la última versión de cada tarea (con Paginación)
    const versions = await list({ status: draft ? 'draft' : 'published' }, page, size, {
      transacting,
    });

    // EN: Get the task info for each result
    // ES: Obtener la información de la tarea para cada resultado
    const taskInfo = await get(
      await Promise.all(
        versions.items.map(async ({ task, version }) => (await parseId(task, version)).fullId)
      ),
      { columns: ['name', 'tagline', 'summary', 'cover', 'color', 'tags'], transacting }
    );

    return { ...versions, items: taskInfo };
  } catch (e) {
    throw new Error(`Error searching task: ${e.message}`);
  }
};
