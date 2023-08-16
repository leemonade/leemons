const { tags: table } = require('../table');

module.exports = async function listTags({ transacting } = {}) {
  try {
    const list = await table.find(
      { tag_$null: false },
      {
        columns: ['tag'],
        transacting,
      }
    );

    return list.map(({ tag }) => tag);
  } catch (e) {
    throw new Error(`Failed to list tags: ${e.message}`);
  }
};
