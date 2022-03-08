const { taskContents: table } = require('../../table');
const parseId = require('../helpers/parseId');

module.exports = async function getContent(task, { transacting } = {}) {
  const { id } = await parseId(task, null, { transacting });

  const existingContent = await table.find(
    {
      task: id,
      $sort: 'position:ASC',
    },
    {
      transacting,
    }
  );

  return {
    count: existingContent.length,
    objectives: existingContent.map(({ content, position }) => ({ content, position })),
  };
};
