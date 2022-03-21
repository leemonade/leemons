const { taskObjectives: table } = require('../../table');

module.exports = async function listContent({ transacting } = {}) {
  try {
    const list = await table.find(
      { content_$null: false },
      {
        columns: ['id', 'content'],
        transacting,
      }
    );

    return list.map(({ content }) => content);
  } catch (e) {
    throw new Error(`Failed to list content: ${e.message}`);
  }
};
