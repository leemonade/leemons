const emit = require('../../events/emit');
const { taskContents: table } = require('../../table');
const taskExists = require('../exists');
const parseId = require('../helpers/parseId');

module.exports = async function addContent(task, subject, contents, { transacting } = {}) {
  const { fullId } = await parseId(task, null, { transacting });

  if (!contents) {
    return [];
  }

  const _content = Array.isArray(contents) ? contents : [contents];

  // EN: Check if task exists.
  // ES: Comprobar si la tarea existe.
  if (!(await taskExists(fullId, { transacting }))) {
    throw new Error('Task not found');
  }

  const createdContent = await table.createMany(
    _content.map((content, i) => ({
      task: fullId,
      subject,
      content,
      position: i,
    })),
    {
      transacting,
    }
  );

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.content.added', `task.${fullId}.content.added`], { id: fullId, subject });

  return createdContent.map(({ content }) => content);
};
