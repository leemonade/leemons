const emit = require('../../events/emit');
const { taskContents: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function removeContent(task, contents, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });
  const _contents = Array.isArray(contents) ? contents : [contents];

  const query = {
    task: id,
  };

  if (contents && _contents?.length) {
    query.contents_$in = _contents;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.content.removed', `task.${id}.content.removed`], { id, content: _contents });

  return deleted;
};
