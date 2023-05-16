const emit = require('../../events/emit');
const { taskContents: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function removeContent(task, subject, contents, { transacting } = {}) {
  const { fullId } = await parseId(task, null, { transacting });
  const _contents = Array.isArray(contents) ? contents : [contents];
  const _subjects = Array.isArray(subject) ? subject : [subject];

  const query = {
    task: fullId,
  };

  if (subject && _subjects?.length) {
    query.subject_$in = _subjects;
  }

  if (contents && _contents?.length) {
    query.contents_$in = _contents;
  }

  const deleted = await table.deleteMany(query, {
    transacting,
  });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.content.removed', `task.${fullId}.content.removed`], {
    id: fullId,
    subject,
    content: _contents,
  });

  return deleted;
};
