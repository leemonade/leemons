const fs = require('fs-extra');
const folderExists = require('./folderExists');

// Create a symbolic link
module.exports = async function createSymLink(src, dest, type = 'dir') {
  try {
    if (await folderExists(src)) {
      return await fs.createSymlink(src, dest, type);
    }
    return null;
  } catch (e) {
    throw new Error("Can't create symlink");
  }
};
