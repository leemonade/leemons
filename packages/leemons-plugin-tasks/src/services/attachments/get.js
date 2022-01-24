const { attachments: table } = require('../table');
const parseId = require('../task/helpers/parseId');

module.exports = async function getAttachment(task, { transacting } = {}) {
  const { fullId } = await parseId(task, null, { transacting });

  const attachments = await table.find({
    task: fullId,
  });

  return {
    count: attachments.length,
    attachments: attachments.map(({ attachment }) => attachment),
  };
};
