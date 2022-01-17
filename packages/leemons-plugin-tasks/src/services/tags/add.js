const { tags: table } = require('../table');
const taskExists = require('../task/exists');
const has = require('./has');

module.exports = async function addTags(task, tags, { transacting } = {}) {
  const _tags = Array.isArray(tags) ? tags : [tags];

  // EN: Check if task exists
  // ES: Comprobar si la tarea existe
  if (!(await taskExists(task, { transacting }))) {
    throw new Error('Task not found');
  }

  // EN: Get non existing tags
  // ES: Obtener etiquetas no existentes
  const { nonExistingTags, nonExistingCount } = await has(task, _tags, { transacting });

  const createdTags = await table.createMany(
    nonExistingTags.map((tag) => ({
      tag,
      task,
    })),
    {
      transacting,
    }
  );

  return { count: nonExistingCount, tags: createdTags.map(({ tag }) => tag) };
};
