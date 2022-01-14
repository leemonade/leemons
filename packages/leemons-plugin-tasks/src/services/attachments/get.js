const { attachments: table } = require('../table');

module.exports = async function getAttachment(task) {
  const attachments = await table.find({
    task,
  });

  return {
    count: attachments.length,
    attachments: attachments.map(({ attachment }) => attachment),
  };
};
