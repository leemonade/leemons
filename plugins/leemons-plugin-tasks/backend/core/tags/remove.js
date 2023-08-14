const emit = require('../events/emit');
const { tags: table } = require('../table');
const parseId = require('../task/helpers/parseId');

module.exports = async function removeTags(task, tags, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });
  const _tags = Array.isArray(tags) ? tags : [tags];

  const query = {
    task: id,
  };

  if (tags && _tags?.length) {
    query.tag_$in = _tags;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.tag.removed', `task.${id}.tag.removed`], { id, tags: _tags });

  return deleted;
};
