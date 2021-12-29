const { categories } = require('../tables');

module.exports = function list(page = 0, size = 10, { transacting } = {}) {
  return global.utils.paginate(categories, page, size, { id_$null: false }, { transacting });
};
