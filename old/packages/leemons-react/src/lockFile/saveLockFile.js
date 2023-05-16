const fs = require('fs-extra');
const path = require('path');
const generateLockFile = require('./generateLockFile');
const getSavedLockFile = require('./getSavedLockFile');
// Save Leemons Lock File if modified
module.exports = async function saveLockFile(dir, plugins) {
  const lockDir = path.resolve(dir, 'leemons.lock.json');
  const lockFile = await generateLockFile(plugins);
  const oldLock = await getSavedLockFile(lockDir);

  if (lockFile.hash !== oldLock.hash) {
    await fs.writeJSON(lockDir, lockFile);
    return true;
  }

  return false;
};
