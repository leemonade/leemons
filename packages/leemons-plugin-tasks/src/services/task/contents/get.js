const { taskContents: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function getContent(task, subject, { transacting } = {}) {
  const { fullId } = await parseId(task, null, { transacting });

  const existingContent = await table.find(
    {
      task: fullId,
      subject,
      $sort: 'position:ASC',
    },
    {
      transacting,
    }
  );

  return {
    count: existingContent.length,
    content: existingContent.map(({ content, position }) => ({ content, position })),
  };
};
