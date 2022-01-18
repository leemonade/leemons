const emit = require('../events/emit');
const { attachments: table } = require('../table');
const taskExists = require('../task/exists');

const attachmentExists = leemons.getPlugin('media-library').services.assets.exists;

module.exports = async function addAttachment(task, attachments, { transacting } = {}) {
  const _attachments = Array.isArray(attachments) ? attachments : [attachments];

  // EN: Check if the task exists.
  // ES: Comprobar si la tarea existe.
  if (!(await taskExists(task, { transacting }))) {
    throw new Error('Task not found');
  }

  // EN: Check if the attachments exists.
  // ES: Comprobar si los adjuntos existen.
  const existance = await Promise.all(
    _attachments.map((attachment) => attachmentExists(attachment, { transacting }))
  );

  if (existance.some((exists) => !exists)) {
    throw new Error('Attachment not found');
  }

  await table.createMany(
    _attachments.map((attachment) => ({
      task,
      attachment,
    })),
    { transacting }
  );

  // EN: Emit the event.
  // ES: Emitir el evento.
  emit(['task.attachment.added', `task.${task}.attachment.added`], {
    id: task,
  });

  return true;
};
