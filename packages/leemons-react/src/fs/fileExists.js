const _fileExists = require('./_fileExists');

module.exports = async function fileExists(path) {
  return _fileExists(path, true);
};
