const fs = require('fs-extra');

module.exports = async function _fileExists(dir, validateFiles = false) {
  try {
    if (!validateFiles) {
      return (await fs.lstat(dir)).isDirectory();
    }

    const stats = await fs.lstat(dir);
    return Boolean(stats) && !stats.isDirectory();
  } catch (e) {
    return false;
  }
};
