const { table } = require('../tables');

async function list(page, size) {
  return global.utils.paginate(table.users, page, size);
}

module.exports = { list };
