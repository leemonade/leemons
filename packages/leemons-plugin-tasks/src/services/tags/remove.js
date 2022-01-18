const emit = require('../events/emit');
const { tags: table } = require('../table');

module.exports = async function removeTags(task, tags, { transacting } = {}) {
  const _tags = Array.isArray(tags) ? tags : [tags];

  const query = {
    task,
  };

  if (_tags.length) {
    query.tag_$in = _tags;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.tag.removed', `task.${task}.tag.removed`], { id: task, tags: _tags });

  return deleted;
};
