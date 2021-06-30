const { table } = require('../tables');

async function list(page, size) {
  return global.utils.paginate(table.profiles, page, size);
}

module.exports = { list };
