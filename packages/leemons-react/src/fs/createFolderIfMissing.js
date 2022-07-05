const createFolder = require('./createFolder');
const folderExists = require('./folderExists');

// Create folder only if does not exists
module.exports = async function createFolderIfMissing(dir) {
  try {
    if (!(await folderExists(dir))) {
      await createFolder(dir);
    }
  } catch (e) {
    throw new Error("Can't create folder");
  }
};
