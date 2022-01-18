const { assets: table } = require('../tables');

module.exports = function details(assets, { userSession, transacting } = {}) {
  return table.find({ id_$in: assets }, { transacting });
};
