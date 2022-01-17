const { files: table } = require('../tables');

module.exports = async function fileExists(file, { transacting } = {}) {
  const _file = await table.count({ id: file }, { transacting });

  return _file > 0;
};
