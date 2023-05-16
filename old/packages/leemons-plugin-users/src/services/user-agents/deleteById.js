const { table } = require('../tables');

async function deleteById(id, { soft, transacting } = {}) {
  return table.userAgent.delete({ id }, { soft, transacting });
}

module.exports = {
  deleteById,
};
