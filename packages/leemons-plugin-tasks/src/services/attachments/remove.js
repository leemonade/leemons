const { attachments: table } = require('../table');

module.exports = async function removeAttachment(task, attachments, { transacting } = {}) {
  const _attachments = Array.isArray(attachments) ? attachments : [attachments];

  const deleted = await table.deleteMany(
    {
      task,
      attachment_$in: _attachments,
    },
    { transacting }
  );

  return deleted;
};
