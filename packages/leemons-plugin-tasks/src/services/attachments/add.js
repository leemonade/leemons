const { attachments: table } = require('../table');

module.exports = async function addAttachment(task, attachments, { transacting } = {}) {
  const _attachments = Array.isArray(attachments) ? attachments : [attachments];
  await table.createMany(
    _attachments.map((attachment) => ({
      task,
      attachment,
    })),
    { transacting }
  );
  return true;
};
