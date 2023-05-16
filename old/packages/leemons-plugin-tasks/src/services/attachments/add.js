const emit = require('../events/emit');
const { attachments: table } = require('../table');
const taskExists = require('../task/exists');
const parseId = require('../task/helpers/parseId');

// const attachmentExists = leemons.getPlugin('leebrary').services.assets.exists;

module.exports = async function addAttachment(task, attachments, { transacting } = {}) {
  try {
    if (!attachments) {
      return false;
    }

    const _attachments = Array.isArray(attachments) ? attachments : [attachments];

    const { fullId, id, version } = await parseId(task, null, { transacting });

    // EN: Check if the task exists.
    // ES: Comprobar si la tarea existe.
    if (!(await taskExists(fullId, { transacting }))) {
      throw new Error('Task not found');
    }

    // EN: Check if the attachments exists.
    // ES: Comprobar si los adjuntos existen.
    // const existance = await Promise.all(
    //   _attachments.map((attachment) => attachmentExists(attachment, { transacting }))
    // );

    // if (existance.some((exists) => !exists)) {
    //   throw new Error('Attachment not found');
    // }

    // EN: Add the attachments to the task (The attachment is associated to the given version).
    // ES: Añadir los adjuntos a la tarea (El adjunto está asociado a la versión dada).
    await table.createMany(
      _attachments.map((attachment) => ({
        task,
        attachment,
      })),
      { transacting }
    );

    // EN: Emit the event.
    // ES: Emitir el evento.
    emit(['task.attachment.added', `task.${id}.attachment.added`], {
      id,
      version,
    });

    return true;
  } catch (e) {
    throw new Error(`Error adding attachment: ${e.message}`);
  }
};
