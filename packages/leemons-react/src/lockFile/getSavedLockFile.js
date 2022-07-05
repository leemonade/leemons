const fs = require('fs-extra');

// Get saved lock file
module.exports = async function getSavedLockFile(lockDir) {
  let oldLock = { hash: null };
  try {
    oldLock = await fs.readJSON(lockDir);
  } catch (e) {
    // Do not throw
  }

  return oldLock;
};
