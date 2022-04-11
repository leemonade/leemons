const emit = require('../events/emit');
const { attachments: table } = require('../table');
const parseId = require('../task/helpers/parseId');

module.exports = async function removeAttachment(task, attachments, { transacting } = {}) {
  const { fullId, id, version } = await parseId(task, null, { transacting });
  const _attachments = Array.isArray(attachments) ? attachments : [attachments];

  const query = {
    task: fullId,
  };

  if (attachments && _attachments.length) {
    query.attachment_$in = _attachments;
  }
  const deleted = await table.deleteMany(query, { transacting });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.attachment.removed', `task.${id}.attachment.removed`], {
    id,
    version,
    attachments: _attachments,
  });

  return deleted;
};
