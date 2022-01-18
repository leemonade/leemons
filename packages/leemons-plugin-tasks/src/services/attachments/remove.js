const emit = require('../events/emit');
const { attachments: table } = require('../table');

module.exports = async function removeAttachment(task, attachments, { transacting } = {}) {
  const _attachments = Array.isArray(attachments) ? attachments : [attachments];

  const query = {
    task,
  };

  if (_attachments.length) {
    query.attachment_$in = _attachments;
  }
  const deleted = await table.deleteMany(query, { transacting });

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.attachment.removed', `task.${task}.attachment.removed`], {
    id: task,
    attachments: _attachments,
  });

  return deleted;
};
