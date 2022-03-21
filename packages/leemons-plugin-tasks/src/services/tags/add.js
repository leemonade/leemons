const emit = require('../events/emit');
const { tags: table } = require('../table');
const taskExists = require('../task/exists');
const parseId = require('../task/helpers/parseId');
const has = require('./has');

module.exports = async function addTags(task, tags, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });
  const { fullId } = await parseId(id, 'any', { transacting });

  if (!tags) {
    return { count: 0, tags: [] };
  }

  const _tags = Array.isArray(tags) ? tags : [tags];

  // EN: Check if task exists.
  // ES: Comprobar si la tarea existe.
  if (!(await taskExists(fullId, { transacting }))) {
    throw new Error('Task not found');
  }

  // EN: Get non existing tags.
  // ES: Obtener etiquetas no existentes.
  const { nonExistingTags, nonExistingCount } = await has(id, _tags, { transacting });

  const createdTags = await table.createMany(
    nonExistingTags.map((tag) => ({
      task: id,
      tag,
    })),
    {
      transacting,
    }
  );

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.tag.added', `task.${id}.tag.added`], { id });

  return { count: nonExistingCount, tags: createdTags.map(({ tag }) => tag) };
};
