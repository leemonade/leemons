const { tables } = require('../tables');

async function find(query, { columns, transacting } = {}) {
  return tables.bookmarks.find(query, { columns, transacting });
}

module.exports = { find };
