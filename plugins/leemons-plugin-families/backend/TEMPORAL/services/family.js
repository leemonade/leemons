const family = require('../src/services/families');

module.exports = {
  add: (data, { transacting } = {}) => family.add(data, null, { fromBulk: true, transacting }),
};
