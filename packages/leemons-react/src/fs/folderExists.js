const _fileExists = require('./_fileExists');

module.exports = async function folderExists(path) {
  return _fileExists(path, false);
};
